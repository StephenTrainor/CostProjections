require('dotenv').config();
var axios = require('axios');

const getPolygonApiKeys = () => {
    const API_KEY = process.env.POLYGON_API_KEYS;

    if (API_KEY === undefined) {
        console.log("POLYGON_API_KEYS not found, add the api key(s) to the .env file and retry.");

        return [];
    }

    return API_KEY.split(',');
}

var currentPolygonApiKeyIndex = 0;
var polygonApiKeys = getPolygonApiKeys();

const fetchTickerSymbols = async (symbol) => {
    const API_URL = `https://api.polygon.io/v3/reference/tickers?market=stocks&search=${symbol}&active=true&sort=ticker&order=asc&limit=100`;

    try {
        const fetchTickerSymbolsResponse = await axios.get(API_URL, {
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
