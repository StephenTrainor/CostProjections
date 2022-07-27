require('dotenv').config();
var axios = require('axios');

const getPolygonApiKeys = () => {
    const API_KEY = process.env.POLYGON_API_KEYS;

    if (API_KEY === undefined) {
        console.log("POLYGON_API_KEYS not found, add the api key(s) to the .env file and retry.");
        process.exit(403);
    }

    return API_KEY.split(',');
}

const { POLYGON_BASE_URL } = process.env;
var currentPolygonApiKeyIndex = 0;
var polygonApiKeys = getPolygonApiKeys();

const fetchTickerSymbols = async (symbol) => {
    const tickerSymbolQuoteUrl = `${POLYGON_BASE_URL}&search=${symbol}`;

    try {
        const fetchTickerSymbolsResponse = await axios.get(tickerSymbolQuoteUrl, {
            params: {
                apiKey: polygonApiKeys[currentPolygonApiKeyIndex]
            }
        });

        return fetchTickerSymbolsResponse.data;
    } catch (error) {
        currentPolygonApiKeyIndex = (currentPolygonApiKeyIndex + 1) % polygonApiKeys.length;

        return {
            status: error.response.status,
            statusMessage: error.response.statusText,
            results: []
        };
    }
};

module.exports = {  
    fetchTickerSymbols: fetchTickerSymbols,
}
