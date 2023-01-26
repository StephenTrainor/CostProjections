import { Button, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import GainLossStackedApexChart from '../components/GainLossStackedApexChart';
import AllTimeVisitsApexChart from '../components/AllTimeVisitsApexChart';
import PriceRangeApexChart from '../components/PriceRangeApexChart';
import FormatDollar from '../components/FormatDollar';
import styles from './Pages.module.css';

import { fetchAirtableRecords, postAirtableRecord, patchAirtableRecords } from '../api/airtableDatabase';
import { fetchStockData } from '../api/iexCloudStockData';

import { pagesConstants, errorConstants } from '../AppConstants';

const theme = createTheme({
    palette: {
        primary: {
            main: pagesConstants.primaryMainLightColor
        }
    }
});

const Quote = () => {
    const [updatedAirtableRecords, setUpdatedAirtableRecords] = useState(false);
    const [currentAirtableRecord, setCurrentAirtableRecord] = useState();
    const [airtableRecords, setAirtableRecords] = useState();
    const [projectedProfitLoss, setProjectedProfitLoss] = useState(0);
    const [previousProfitLoss, setPreviousProfitLoss] = useState(0);
    const [avgCostChange, setAvgCostChange] = useState(0);
    const [calculation, setCalculation] = useState(0);
    const [stockData, setStockData] = useState();

    const navigate = useNavigate();
    var { state } = useLocation();

    const { userInput } = state;
    const { INDEX_PAGE_URL } = pagesConstants;
    const { errorMessages, errorCodes, successCodes } = errorConstants;
    const { invalidSymbolErrorText, invalidTargetAvgCostErrorText } = errorMessages;

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
            userInput: {
                ...state.userInput
            },
            errors: {
                targetAvgCost: true,
                targetAvgCostErrorText: invalidTargetAvgCostErrorText,
            },
            edit: true,
        };

        navigate(INDEX_PAGE_URL, { state });
    }

    const redirectInvalidTickerSymbol = () => {
        state = {
            userInput: {
                ...state.userInput
            },
            errors: {
                symbol: true,
                symbolErrorText: invalidSymbolErrorText,
            },
            edit: true,
        };

        navigate(INDEX_PAGE_URL, { state });
    }

    const redirectEditFormRequest = (event) => {
        event.preventDefault();

        state = {
            userInput: {
                ...state.userInput
            },
            edit: true,
        };

        navigate(INDEX_PAGE_URL, { state });
    }

    const redirectToHome = (event) => {
        event.preventDefault();

        navigate(INDEX_PAGE_URL);
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

            if (symbol === userInput.symbol.toUpperCase()) {
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
                "symbol": userInput.symbol.toUpperCase(),
                "allTimeVisits": 1,
                "losingPositions": (avgCostChange < 0 ? 1 : 0),
                "gainingPositions": (avgCostChange >= 0 ? 1 : 0),
            }
        });
    }

    const storeFetchedStockData = async () => {
        const stockData = await fetchStockData(userInput.symbol);

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

        if (!stockData && userInput && userInput.symbol) {
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
            if (stockData.statusCode === successCodes.OK_CODE) {
                for (const [key, value] of Object.entries(userInput)) {
                    userInput[key] = value.replaceAll("$", "").replaceAll(",", "");
                };

                const { latestPrice } = stockData;
                const newCash = (userInput.newEquityOption === "CA") ? parseFloat(userInput.cash) : parseFloat(userInput.newShares) * latestPrice;
                const shares = parseFloat(userInput.shares);
                const avgCost = parseFloat(userInput.avgCost);
                const targetAvgCost = parseFloat(userInput.targetAvgCost);

                if (userInput.option === "DCAP") {
                    const currentTotalValue = shares * avgCost;
                    const purchasableShares = newCash / latestPrice;
                    const totalShares = shares + purchasableShares;

                    const newAverageCost = (currentTotalValue + newCash) / totalShares;

                    setProjectedProfitLoss(((latestPrice / newAverageCost) - 1) * 100);
                    setAvgCostChange(newAverageCost - avgCost);
                    setCalculation(newAverageCost);
                }
                else if (userInput.option === "CNP") {
                    if (isAverageCostAchievable(avgCost, targetAvgCost, latestPrice)) {
                        const numerator = shares * (avgCost - targetAvgCost);
                        const denominator = targetAvgCost - latestPrice;

                        const sharesNeeded = (denominator === 0) ? 0 : numerator / denominator;

                        setProjectedProfitLoss(((latestPrice / targetAvgCost) - 1) * 100);
                        setAvgCostChange(latestPrice - avgCost);
                        setCalculation(sharesNeeded);
                    }
                    else {
                        redirectInvalidTargetAvgCost();
                    }
                }

                setPreviousProfitLoss(((latestPrice / avgCost) - 1) * 100); // convert to percentage
            }
            else if (stockData.statusCode === errorCodes.INVALID_TICKER_SYMBOL_ERROR_CODE) {
                redirectInvalidTickerSymbol();
            }
        }
    }, [stockData, redirectInvalidTickerSymbol, redirectInvalidTargetAvgCost, storeFetchedStockData, fetchAndUpdateAirtableRecords]);

    return (
        <>
        {(userInput && userInput !== null) ? (
        <Box
            className={styles.centeredContainer}
        >
            <h1>
                Results for {(stockData) ? stockData.companyName : ""} ({userInput.symbol.toUpperCase()})
            </h1>
            <div className={styles.centeredContainer}>
                <PriceRangeApexChart state={userInput} calculation={calculation} latestPrice={(stockData && stockData.latestPrice) ? stockData.latestPrice : 0} />
            </div>
            <div>
                <h3>
                    {(userInput.option === "DCAP") ? "New Average:" : "Cash Needed:"}
                </h3>
                {(userInput.option === "DCAP") ? 
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
                            (userInput.option === "DCAP") ? 
                                <FormatDollar 
                                    number={(userInput.newEquityOption === "CA") ? userInput.cash : userInput.newShares}
                                    prefix={(userInput.newEquityOption === "CA") ? "$" : ""}
                                    preText={`Purchasing `}
                                    postText={`${(userInput.newEquityOption === "NS") ? " share(s)" : ""} of ${userInput.symbol.toUpperCase()} will ${(avgCostChange < 0) ? "decrease" : "increase"} your average cost by $${round(((avgCostChange < 0) ? avgCostChange * -1 : avgCostChange), 2)}/share at the current price of $${(stockData) ? round(stockData.latestPrice, 2) : 0}`}
                                />
                            : 
                                <FormatDollar 
                                    number={(stockData) ? calculation * stockData.latestPrice : calculation}
                                    preText={`Changing your average cost to $${round(parseInt(userInput.targetAvgCost, 10), 2)} requires `}
                                    postText={` or ${round(calculation, 4)} shares at the current price of $${(stockData) ? round(stockData.latestPrice, 2) : 0}`}
                                />
                        }
                    </div>
                </div>
                <div className={styles.centeredContainer}>
                    <div className={styles.textDescription}>
                        <h3 className={styles.removeBold}>
                            {`Your ${(avgCostChange < 0) ? "losses" : "profits"} would change from ${(avgCostChange < 0) ? "" : "+"}${round(previousProfitLoss, 2)}% to ${(avgCostChange < 0) ? "" : "+"}${round(projectedProfitLoss, 2)}%`}
                        </h3>
                    </div>
                </div>
            </div>
            <ThemeProvider theme={theme}>
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
            </ThemeProvider>
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
