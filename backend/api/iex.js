require('dotenv').config();
var axios = require('axios');

const API_BASE_URL = "https://cloud.iexapis.com/v1";

const get_API_KEY = () => {
    const API_KEY = process.env.API_KEY;

    if (API_KEY === undefined) {
        console.log("API_KEY hasn't been set. Define the environment variable and try again.");
        return "";
    }

    return API_KEY;
};

const get_response = async (url) => {
    try {
        var response = await axios.get(url, {
            params: {
                token: get_API_KEY()
            }
        });
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
        };
    };

    return {
        ...response.data,
        statusCode: response.request.res.statusCode
    };
};

const stockQuote = async (tickerSymbol) => {
    const STOCK_URL = `${API_BASE_URL}/stock/${tickerSymbol}/quote`;

    return await get_response(STOCK_URL);
};

const cryptoQuote = async (symbol) => {
    const CRYPTO_URL = `${API_BASE_URL}/crypto/${symbol}/quote`;

    return await get_response(CRYPTO_URL);
};

/*
Both cannot be used with free plan for IEX Cloud

const currencyQuote = async (symbol) => {
    const CURRENCY_URL = `${API_BASE_URL}/fx/latest?symbols=${symbol}`;

    return await get_response(CURRENCY_URL);
};

const currencyConvert = async (symbol, initialAmount) => {
    const CURRENCY_CONVERT_URL = `${API_BASE_URL}/fx/convert?symbols=${symbol}&amount=${initialAmount}`;

    return await get_response(CURRENCY_CONVERT_URL);
};
*/

module.exports = {
    stockQuote: stockQuote,
    cryptoQuote: cryptoQuote,
    // currencyQuote: currencyQuote,
    // currencyConvert: currencyConvert
};
