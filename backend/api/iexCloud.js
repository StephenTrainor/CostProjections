require('dotenv').config();
var axios = require('axios');

const {
    IEXCLOUD_BASE_URL,
    IEXCLOUD_API_KEY
} = process.env;

const fetchStockQuote = async (tickerSymbol) => {
    const stockQuoteUrl = `${IEXCLOUD_BASE_URL}/stock/${tickerSymbol}/quote`;

    try {
        const getStockQuoteResponse = await axios.get(stockQuoteUrl, {
            params: {
                token: IEXCLOUD_API_KEY
            }
        });

        return {
            ...getStockQuoteResponse.data,
            statusCode: 200
        }
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText
        }
    }
};

module.exports = {
    fetchStockQuote: fetchStockQuote,
};
