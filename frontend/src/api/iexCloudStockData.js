require('dotenv').config();
import axios from 'axios';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:9000";

const fetchStockData = async (tickerSymbol) => {
    const STOCK_QUOTE_URL = `${BACKEND_BASE_URL}/quote/${tickerSymbol}`;

    try {
        const getStockDataResponse = await axios.get(STOCK_QUOTE_URL);

        return getStockDataResponse.data;
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
        }
    }
};

export {
    fetchStockData
};
