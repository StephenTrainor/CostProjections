import axios from 'axios';
import { apiConstants } from '../AppConstants';

const { BACKEND_BASE_URL } = apiConstants;

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
