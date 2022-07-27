require('dotenv').config();
var axios = require('axios')

const {
    AIRTABLE_BASE_URL,
    AIRTABLE_API_KEY
} = process.env;

const fetchAllAirtableRecords = async () => {
    try {
        const getAllFieldsResponse = await axios({
            url: AIRTABLE_BASE_URL,
            method: 'get',
            params: {
                api_key: AIRTABLE_API_KEY
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
            url: AIRTABLE_BASE_URL,
            method: 'post',
            data: JSON.stringify(postParams),
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: AIRTABLE_API_KEY
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
            url: AIRTABLE_BASE_URL,
            method: 'patch',
            data: JSON.stringify(patchParams),     
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                api_key: AIRTABLE_API_KEY
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
