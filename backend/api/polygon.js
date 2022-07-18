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

var apiKey = 0;
var apiKeys = getPolygonApiKeys();

const get_response = async (url) => {
    try {
        var response = await axios.get(url, { params: {
            apiKey: apiKeys[apiKey]
        } });
    } catch (error) {
        apiKey = (apiKey + 1) % apiKeys.length;

        response = {
            data: {
                status: error.response.status,
                statusMessage: error.response.statusText,
                results: [],
            },
        };
    }

    if (response) {
        return response.data;
    }
};

const getSymbols = async (symbol) => {
    const API_URL = `https://api.polygon.io/v3/reference/tickers?market=stocks&search=${symbol}&active=true&sort=ticker&order=asc&limit=100`;

    return await get_response(API_URL);
};

module.exports = {  
    getSymbols: getSymbols,
}
