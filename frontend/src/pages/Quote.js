import axios from 'axios';
import { Button, Box, } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GainLossStackedApexChart from '../components/GainLossStackedApexChart';
import AllTimeVisitsApexChart from '../components/AllTimeVisitsApexChart';
import PriceRangeApexChart from '../components/PriceRangeApexChart';
import FormatDollar from '../components/FormatDollar';
import styles from './Pages.module.css';

const Quote = () => {
    const BACKEND_BASE_URL = "http://127.0.0.1:9000";
    const [updatedAirtableRecords, setUpdatedAirtableRecords] = useState(false);
    const [currentAirtableRecord, setCurrentAirtableRecord] = useState();
    const [airtableRecords, setAirtableRecords] = useState();
    const [calculation, setCalculation] = useState(0);
    const [change, setChange] = useState(0);
    const [data, setData] = useState();
    const navigate = useNavigate();
    var { state } = useLocation();

    const usd = (val, precision) => {
        let places = Math.pow(10, precision);

        return Math.round(val * places) / places;
    };

    const averageCostAchievable = (currentAvgCost, targetAvgCost, latestPrice) => {
        if (currentAvgCost <= targetAvgCost && targetAvgCost <= latestPrice) {
            return true;
        }
        else if (latestPrice <= targetAvgCost && targetAvgCost <= currentAvgCost) {
            return true;
        }
        return false;
    };

    const fixRequest = () => {
        state = {
            ...state,
            edit: true,
            target: true,
            targetErrorText: 'Invalid Target Average Cost',
        };

        navigate("/", { state });
    }

    const fixSymbol = () => {
        state = {
            ...state,
            symbol: true,
            symbolErrorText: 'Invalid Symbol',
        };

        navigate("/", { state });
    }

    const editRequest = (event) => {
        event.preventDefault();

        state = {
            ...state,
            edit: true,
            targetAvgCost: false,
        };

        navigate("/", { state });
    }

    const goBack = (event) => {
        event.preventDefault();

        navigate("/");
    }

    const fetchAirtableRecords = async () => {
        if (!change) {
            return;
        }

        const RETRIEVE_AIRTABLE_URL = `${BACKEND_BASE_URL}/table`;

        try {
            var response = await axios.get(RETRIEVE_AIRTABLE_URL, {});
        } catch (error) {
            response = {
                data: {
                    statusCode: error.response.status,
                    statusMessage: error.response.statusText,
                    records: [],
                },
            };
        }

        setAirtableRecords([
            ...response.data.records,
        ]);

        for (let airtableRecord of response.data.records) {
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
                        "losingPositions": losingPositions + (change < 0 ? 1 : 0),
                        "gainingPositions": gainingPositions + (change >= 0 ? 1 : 0),
                    }
                });
                return;
            }
        }

        setCurrentAirtableRecord({
            "fields": {
                "symbol": state.symbol.toUpperCase(),
                "allTimeVisits": 1,
                "losingPositions": (change < 0 ? 1 : 0),
                "gainingPositions": (change >= 0 ? 1 : 0),
            }
        });
    }

    const postAirtableRecord = async (newAirtableRecord) => {
        const {
            symbol,
            allTimeVisits,
            losingPositions,
            gainingPositions,
        } = newAirtableRecord.fields;

        const POST_AIRTABLE_RECORD_URL = `${BACKEND_BASE_URL}/table/${symbol}/${allTimeVisits}/${losingPositions}/${gainingPositions}`;

        try {
            var response = await axios.post(POST_AIRTABLE_RECORD_URL);
        } catch (error) {
            console.log(error);
        }

        if (!response.data.records) {
            console.log("Error when issuing POST request to the Airtable records");
        }
    }

    const patchAirtableRecords = async (currentAirtableRecord) => {
        const {id} = currentAirtableRecord;
        const {
            symbol,
            allTimeVisits,
            losingPositions,
            gainingPositions,
        } = currentAirtableRecord.fields;

        const PATCH_AIRTABLE_RECORDS_URL = `${BACKEND_BASE_URL}/table/${id}/${symbol}/${allTimeVisits}/${losingPositions}/${gainingPositions}`;
    
        try {
            var response = await axios.patch(PATCH_AIRTABLE_RECORDS_URL);
        } catch (error) {
            console.log(error);
        }

        if (!response.data.records) {
            console.log("Error when issuing PATCH request to the Airtable records");
        }
    };
    
    const getResponse = async () => {
        const STOCK_QUOTE_URL = `${BACKEND_BASE_URL}/quote/${state.symbol}`;

        try {
            var response = await axios.get(STOCK_QUOTE_URL);
        } catch (error) {
            response = {
                data: {
                    statusCode: error.response.status,
                    statusMessage: error.response.statusText,
                },
            };
        }

        setData({
            ...response.data,
        });
    };

    useEffect(() => {
        if (state === null) {
            navigate("/", { state });
        }
    }, [navigate, state]);

    useEffect(() => {
        if (!airtableRecords) {
            fetchAirtableRecords();
        }

        if (!data && state && state.symbol) {
            getResponse();
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

        if (data) { 
            if (data.statusCode === 200) {
                const { latestPrice } = data;
                const newCash = (state.cash) ? parseInt(state.cash, 10) : parseInt(state.newShares, 10) * latestPrice;
                const shares = parseInt(state.shares, 10);
                const avgCost = parseInt(state.avgCost, 10);
                const targetAvgCost = parseInt(state.targetAvgCost, 10);

                if (state.option === "DCAP") {
                    const currentTotalValue = shares * avgCost;
                    const purchasableShares = newCash / latestPrice;
                    const totalShares = shares + purchasableShares;

                    const newAverageCost = (currentTotalValue + newCash) / totalShares;

                    setChange(newAverageCost - avgCost);
                    setCalculation(newAverageCost);
                }
                else if (state.option === "CNP") {
                    if (averageCostAchievable(avgCost, targetAvgCost, latestPrice)) {
                        const numerator = shares * (avgCost - targetAvgCost);
                        const denominator = targetAvgCost - latestPrice;

                        const sharesNeeded = (denominator === 0) ? 0 : numerator / denominator;

                        setChange(latestPrice - avgCost);
                        setCalculation(sharesNeeded);
                    }
                    else {
                        fixRequest();
                    }
                }
            }
            else if (data.statusCode === 404) {
                fixSymbol();
            }
        }
    }, [data, fixSymbol, fixRequest, getResponse, fetchAirtableRecords]);

    return (
        <>
        {(state && state !== null) ? (
        <Box
            className={styles.centeredContainer}
        >
            <h1>
                Results for {(data) ? data.companyName : ""} ({state.symbol.toUpperCase()})
            </h1>
            <div className={styles.centeredContainer}>
                <PriceRangeApexChart state={state} calculation={calculation} latestPrice={(data && data.latestPrice) ? data.latestPrice : 0} />
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
                        number={(data) ? calculation * data.latestPrice : calculation}
                        postText={` / ${usd(calculation, 4)} shares`}
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
                                    postText={`${(state.newShares) ? " share(s)" : ""} of ${state.symbol.toUpperCase()} will ${(change < 0) ? "decrease" : "increase"} your average cost by $${usd(((change < 0) ? change * -1 : change), 2)}/share at the current price of $${(data) ? usd(data.latestPrice, 2) : 0}`}
                                />
                            : 
                                <FormatDollar 
                                    number={(data) ? calculation * data.latestPrice : calculation}
                                    preText={`Changing your average cost to $${usd(parseInt(state.targetAvgCost, 10), 2)} requires `}
                                    postText={` or ${usd(calculation, 4)} shares at the current price of $${(data) ? usd(data.latestPrice, 2) : 0}`}
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
                        onClick={(event) => {editRequest(event)}}
                    >
                        Edit Request
                    </Button>
                </div>
                <div className={styles.rowFlexBox}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(event) => {goBack(event)}}
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
