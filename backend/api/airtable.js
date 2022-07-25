require('dotenv').config();
var axios = require('axios')

const airtableBaseUrl = "https://api.airtable.com/v0/app7hfcC8xLOdgVDf/Projects";

const retrieveAirtableApiKey = () => {
    const airtableApiKey = process.env.AIRTABLE_API_KEY;

    if (airtableApiKey === undefined) {
        console.log("AIRTABLE_API_KEY hasn't been set. Define the environment variable and try again.");
        process.exit(403);
    }

    return airtableApiKey;
};

const fetchAllAirtableRecords = async () => {
    try {
        const getAllFieldsResponse = await axios({
            url: airtableBaseUrl,
            method: 'get',
            params: {
                api_key: retrieveAirtableApiKey()
            }
        });

        return getAllFieldsResponse.data;
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        };
    }
};

const postAirtableRecord = async (postParams) => {
    try {
        const postRecordResponse = await axios({
            url: airtableBaseUrl,
            method: 'post',
            data: JSON.stringify(postParams),
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: retrieveAirtableApiKey()
            }
        });

        return postRecordResponse.data;
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        }
    }
};

const patchAirtableRecord = async (patchParams) => {
    try {
        const patchRecordResponse = await axios({
            url: airtableBaseUrl,
            method: 'patch',
            data: JSON.stringify(patchParams),     
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: retrieveAirtableApiKey()
            }
        });

        return patchRecordResponse.data;
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        }
    }
};

module.exports = {
    fetchAllAirtableRecords: fetchAllAirtableRecords,
    patchAirtableRecord: patchAirtableRecord,
    postAirtableRecord: postAirtableRecord,
};
