import axios from 'axios';
import { Button, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApexChart from '../components/ApexChart';
import FormatDollar from '../components/FormatDollar';
import styles from '../App.module.css';

const Quote = () => {
    const API_URL = "http://127.0.0.1:9000/quote";
    // const API_URL = "http://{IP_ADDRESS}:9000/quote";
    const [data, setData] = useState();
    const [calculation, setCalculation] = useState(0);
    const [change, setChange] = useState(0);
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

    const getResponse = async () => {
        const STOCK_QUOTE_URL = `${API_URL}/${state.symbol}`;

        try {
            var response = await axios.get(STOCK_QUOTE_URL, { params: {} });
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
        if (!data && state && state.symbol) {
            getResponse();
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
    }, [data, fixSymbol, fixRequest, getResponse]);

    return (
        <>
        {(state && state !== null) ? (
        <Box
            className={styles.box}
        >
            <h1>Results for {(data) ? data.companyName : ""} ({state.symbol.toUpperCase()})</h1>
            <div>
                <ApexChart state={state} calculation={calculation} latestPrice={(data && data.latestPrice) ? data.latestPrice : 0} />
            </div>
            <div>
                <h3 className={styles.header}>
                    {(state.option === "DCAP") ? "New Average:" : "Cash Needed:"}
                </h3>
                <div>
                    <div>
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
                    </div>
                    <h4 className={styles.shortText}>
                        {
                            (state.option === "DCAP") ? 
                                <FormatDollar 
                                    number={(state.cash) ? state.cash : state.newShares}
                                    prefix={(state.cash) ? "$" : ""}
                                    preText={`Purchasing `}
                                    postText={`${(state.newShares) ? " share(s)" : ""} of ${state.symbol.toUpperCase()} will ${(change < 0) ? "decrease" : "increase"} your average cost by $${usd(change, 2)}/share at the current price of $${(data) ? usd(data.latestPrice, 2) : 0}`}
                                />
                            : 
                                <FormatDollar 
                                    number={(data) ? calculation * data.latestPrice : calculation}
                                    preText={`Changing your average cost to $${usd(parseInt(state.targetAvgCost, 10), 2)} requires `}
                                    postText={` or ${usd(calculation, 4)} shares at the current price of $${(data) ? usd(data.latestPrice, 2) : 0}`}
                                />
                        }
                    </h4>
                </div>
            </div>
            <div className={styles.div}>
                <div className={styles.div}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(event) => {editRequest(event)}}
                    >
                        Edit Request
                    </Button>
                </div>
                <div className={styles.div}>
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={(event) => {goBack(event)}}
                    >
                        New Request
                    </Button>
                </div>
            </div>
        </Box>)
        : (<></>)}
        </>
    );
};

export default Quote;
