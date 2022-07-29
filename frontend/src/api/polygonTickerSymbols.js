require('dotenv').config();
import axios from 'axios';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? "http://127.0.0.1:9000";

const fetchTickerSymbols = async (enteredSymbol) => {
    const backendTickerSymbolsApiUrl = `${BACKEND_BASE_URL}/symbol/${enteredSymbol}`;

    try {
        const getTickerSymbolsResponse = await axios.get(backendTickerSymbolsApiUrl);

        return getTickerSymbolsResponse.data;
    } catch (error) {
        if (error.response.status !== 429) {
            return {
                statusCode: error.response.status,
                statusMessage: error.response.statusText,
                results: [],
            }
        }
    }
};

export {
    fetchTickerSymbols
};
