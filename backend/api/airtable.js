require('dotenv').config();
var axios = require('axios')

const AIRTABLE_BASE_URL = "https://api.airtable.com/v0/app7hfcC8xLOdgVDf/Projects";

const getAirtableApiKey = () => {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

    if (AIRTABLE_API_KEY === undefined) {
        console.log("AIRTABLE_API_KEY hasn't been set. Define the environment variable and try again.");
        return "";
    }

    return AIRTABLE_API_KEY;
};

const fetchAllAirtableFields = async () => {
    try {
        var response = await axios.get(`${AIRTABLE_BASE_URL}?api_key=${getAirtableApiKey()}`, { params: {} });
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        };
    }

    return response.data;
};

const postAirtableRecord = async (postParams) => {
    try {
        var response = await axios({
            url: AIRTABLE_BASE_URL,
            method: 'post',
            data: JSON.stringify(postParams),
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: getAirtableApiKey()
            }
        })
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        }
    }

    return response.data;
};

const patchAirtableRecord = async (patchParams) => {
    try {
        var response = await axios({
            url: AIRTABLE_BASE_URL,
            method: 'patch',
            data: JSON.stringify(patchParams),     
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: getAirtableApiKey()
            }
        });
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        }
    }

    return response.data;
};

module.exports = {
    fetchAllAirtableFields: fetchAllAirtableFields,
    patchAirtableField: patchAirtableRecord,
    postAirtableRecord: postAirtableRecord,
};
