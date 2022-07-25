require('dotenv').config();
var axios = require('axios');

const iexCloudBaseUrl = "https://cloud.iexapis.com/v1";

const retrieveIexCloudApiKey = () => {
    const iexCloudApiKey = process.env.IEXCLOUD_API_KEY;

    if (iexCloudApiKey === undefined) {
        console.log("IEXCLOUD_API_KEY hasn't been set. Define the environment variable and try again.");
        process.exit(403);
    }

    return iexCloudApiKey;
};

const fetchStockQuote = async (tickerSymbol) => {
    const stockQuoteUrl = `${iexCloudBaseUrl}/stock/${tickerSymbol}/quote`;

    try {
        const getStockQuoteResponse = await axios.get(stockQuoteUrl, {
            params: {
                token: retrieveIexCloudApiKey()
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
