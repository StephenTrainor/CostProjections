import axios from 'axios';
import { apiConstants, errorConstants } from '../AppConstants';

const { BACKEND_BASE_URL} = apiConstants;
const { TOO_MANY_REQUESTS_ERROR_CODE } = errorConstants.errorCodes;

const fetchTickerSymbols = async (enteredSymbol) => {
    const backendTickerSymbolsApiUrl = `${BACKEND_BASE_URL}/symbol/${enteredSymbol}`;

    try {
        const getTickerSymbolsResponse = await axios.get(backendTickerSymbolsApiUrl);

        return getTickerSymbolsResponse.data;
    } catch (error) {
        if (error.response.status !== TOO_MANY_REQUESTS_ERROR_CODE) {
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
