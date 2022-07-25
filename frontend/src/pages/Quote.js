import { Button, Box, } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GainLossStackedApexChart from '../components/GainLossStackedApexChart';
import AllTimeVisitsApexChart from '../components/AllTimeVisitsApexChart';
import PriceRangeApexChart from '../components/PriceRangeApexChart';
import FormatDollar from '../components/FormatDollar';
import styles from './Pages.module.css';

import { fetchAirtableRecords, postAirtableRecord, patchAirtableRecords } from '../api/airtableDatabase';
import { fetchStockData } from '../api/iexCloudStockData';

const Quote = () => {
    const HOME_PAGE_URL = "/";
    const [updatedAirtableRecords, setUpdatedAirtableRecords] = useState(false);
    const [currentAirtableRecord, setCurrentAirtableRecord] = useState();
    const [airtableRecords, setAirtableRecords] = useState();
    const [avgCostChange, setAvgCostChange] = useState(0);
    const [calculation, setCalculation] = useState(0);
    const [stockData, setStockData] = useState();
    const navigate = useNavigate();
    var { state } = useLocation();

    const round = (val, precision) => {
        let places = Math.pow(10, precision);

        return Math.round(val * places) / places;
    };

    const isAverageCostAchievable = (currentAvgCost, targetAvgCost, latestPrice) => {
        if (currentAvgCost <= targetAvgCost && targetAvgCost <= latestPrice) {
            return true;
        }
        else if (latestPrice <= targetAvgCost && targetAvgCost <= currentAvgCost) {
            return true;
        }
        return false;
    };

    const redirectInvalidTargetAvgCost = () => {
        state = {
            ...state,
            edit: true,
            target: true,
            targetErrorText: 'Invalid Target Average Cost',
        };

        navigate(HOME_PAGE_URL, { state });
    }

    const redirectInvalidTickerSymbol = () => {
        state = {
            ...state,
            symbol: true,
            symbolErrorText: 'Invalid Symbol',
        };

        navigate(HOME_PAGE_URL, { state });
    }

    const redirectEditFormRequest = (event) => {
        event.preventDefault();

        state = {
            ...state,
            edit: true,
        };

        navigate(HOME_PAGE_URL, { state });
    }

    const redirectToHome = (event) => {
        event.preventDefault();

        navigate(HOME_PAGE_URL);
    }

    const fetchAndUpdateAirtableRecords = async () => {
        if (!avgCostChange) {
            return;
        }

        const fetchedAirtableRecords = await fetchAirtableRecords();

        setAirtableRecords([
            ...fetchedAirtableRecords
        ]);

        for (let airtableRecord of fetchedAirtableRecords) {
            const {
                id
            } = airtableRecord;
            const {
                symbol,
                allTimeVisits,
                losingPositions,
                gainingPositions,
            } = airtableRecord.fields;

            if (symbol === state.symbol) {
                setCurrentAirtableRecord({
                    "id": id,
                    "fields": {
                        "symbol": symbol,
                        "allTimeVisits": allTimeVisits + 1,
                        "losingPositions": losingPositions + (avgCostChange < 0 ? 1 : 0),
                        "gainingPositions": gainingPositions + (avgCostChange >= 0 ? 1 : 0),
                    }
                });
                return;
            }
        }

        setCurrentAirtableRecord({
            "fields": {
                "symbol": state.symbol.toUpperCase(),
                "allTimeVisits": 1,
                "losingPositions": (avgCostChange < 0 ? 1 : 0),
                "gainingPositions": (avgCostChange >= 0 ? 1 : 0),
            }
        });
    }

    const storeFetchedStockData = async () => {
        const stockData = await fetchStockData(state.symbol);

        setStockData({
            ...stockData
        });
    };

    useEffect(() => {
        if (state === null) {
            navigate("/", { state });
        }
    }, [navigate, state]);

    useEffect(() => {
        if (!airtableRecords) {
            fetchAndUpdateAirtableRecords();
        }

        if (!stockData && state && state.symbol) {
            storeFetchedStockData();
        }

        if (!updatedAirtableRecords && currentAirtableRecord) {
            if (currentAirtableRecord.id) {
                patchAirtableRecords(currentAirtableRecord);
            }
            else {
                postAirtableRecord(currentAirtableRecord);
            }
            setUpdatedAirtableRecords(true);
        }

        if (stockData) { 
            if (stockData.statusCode === 200) {
                const { latestPrice } = stockData;
                const newCash = (state.cash) ? parseInt(state.cash, 10) : parseInt(state.newShares, 10) * latestPrice;
                const shares = parseInt(state.shares, 10);
                const avgCost = parseInt(state.avgCost, 10);
                const targetAvgCost = parseInt(state.targetAvgCost, 10);

                if (state.option === "DCAP") {
                    const currentTotalValue = shares * avgCost;
                    const purchasableShares = newCash / latestPrice;
                    const totalShares = shares + purchasableShares;

                    const newAverageCost = (currentTotalValue + newCash) / totalShares;

                    setAvgCostChange(newAverageCost - avgCost);
                    setCalculation(newAverageCost);
                }
                else if (state.option === "CNP") {
                    if (isAverageCostAchievable(avgCost, targetAvgCost, latestPrice)) {
                        const numerator = shares * (avgCost - targetAvgCost);
                        const denominator = targetAvgCost - latestPrice;

                        const sharesNeeded = (denominator === 0) ? 0 : numerator / denominator;

                        setAvgCostChange(latestPrice - avgCost);
                        setCalculation(sharesNeeded);
                    }
                    else {
                        redirectInvalidTargetAvgCost();
                    }
                }
            }
            else if (stockData.statusCode === 404) {
                redirectInvalidTickerSymbol();
            }
        }
    }, [stockData, redirectInvalidTickerSymbol, redirectInvalidTargetAvgCost, storeFetchedStockData, fetchAndUpdateAirtableRecords]);

    return (
        <>
        {(state && state !== null) ? (
        <Box
            className={styles.centeredContainer}
        >
            <h1>
                Results for {(stockData) ? stockData.companyName : ""} ({state.symbol.toUpperCase()})
            </h1>
            <div className={styles.centeredContainer}>
                <PriceRangeApexChart state={state} calculation={calculation} latestPrice={(stockData && stockData.latestPrice) ? stockData.latestPrice : 0} />
            </div>
            <div>
                <h3>
                    {(state.option === "DCAP") ? "New Average:" : "Cash Needed:"}
                </h3>
                {(state.option === "DCAP") ? 
                    <FormatDollar 
                        number={calculation}
                        postText={`/share`}
                    /> 
                :
                    <FormatDollar 
                        number={(stockData) ? calculation * stockData.latestPrice : calculation}
                        postText={` / ${round(calculation, 4)} shares`}
                    />
                }
                <div className={styles.centeredContainer}>
                    <div className={styles.textDescription}>
                        {
                            (state.option === "DCAP") ? 
                                <FormatDollar 
                                    number={(state.cash) ? state.cash : state.newShares}
                                    prefix={(state.cash) ? "$" : ""}
                                    preText={`Purchasing `}
                                    postText={`${(state.newShares) ? " share(s)" : ""} of ${state.symbol.toUpperCase()} will ${(avgCostChange < 0) ? "decrease" : "increase"} your average cost by $${round(((avgCostChange < 0) ? avgCostChange * -1 : avgCostChange), 2)}/share at the current price of $${(stockData) ? round(stockData.latestPrice, 2) : 0}`}
                                />
                            : 
                                <FormatDollar 
                                    number={(stockData) ? calculation * stockData.latestPrice : calculation}
                                    preText={`Changing your average cost to $${round(parseInt(state.targetAvgCost, 10), 2)} requires `}
                                    postText={` or ${round(calculation, 4)} shares at the current price of $${(stockData) ? round(stockData.latestPrice, 2) : 0}`}
                                />
                        }
                    </div>
                </div>
            </div>
            <div className={styles.rowFlexBox}>
                <div className={styles.rowFlexBox}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(event) => {redirectEditFormRequest(event)}}
                    >
                        Edit Request
                    </Button>
                </div>
                <div className={styles.rowFlexBox}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(event) => {redirectToHome(event)}}
                    >
                        New Request
                    </Button>
                </div>
            </div>
            <h1>
                Analytics
            </h1>
            <div className={styles.centeredContainer}>
                <GainLossStackedApexChart 
                    currentAirtableRecord={currentAirtableRecord}
                />
            </div>
            <div className={styles.centeredContainer}>
                <AllTimeVisitsApexChart 
                    airtableRecords={airtableRecords}
                />
            </div>
        </Box>)
        : (<></>)}
        </>
    );
};

export default Quote;
