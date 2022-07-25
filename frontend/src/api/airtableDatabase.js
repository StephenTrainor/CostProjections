import axios from 'axios';

const BACKEND_BASE_URL = "http://127.0.0.1:9000";

const fetchAirtableRecords = async () => {
    const RETRIEVE_AIRTABLE_URL = `${BACKEND_BASE_URL}/table`;

    try {
        const fetchRecordsResponse = await axios.get(RETRIEVE_AIRTABLE_URL);

        return fetchRecordsResponse.data.records;
    } catch (error) {
        return {
            statusCode: error.response.status,
            statusMessage: error.response.statusText,
            records: [],
        }
    }
};

const postAirtableRecord = async (newAirtableRecord) => {
    const {
        symbol,
        allTimeVisits,
        losingPositions,
        gainingPositions,
    } = newAirtableRecord.fields;

    const POST_AIRTABLE_RECORD_URL = `${BACKEND_BASE_URL}/table/${symbol}/${allTimeVisits}/${losingPositions}/${gainingPositions}`;

    try {
        const postRecordResponse = await axios.post(POST_AIRTABLE_RECORD_URL);

        if (!postRecordResponse.data.records) {
            console.log("Error when issuing POST request to the Airtable records");
        }
    } catch (error) {
        console.log(error);
    }
};

const patchAirtableRecords = async (currentAirtableRecord) => {
    const {id} = currentAirtableRecord;
    const {
        symbol,
        allTimeVisits,
        losingPositions,
        gainingPositions,
    } = currentAirtableRecord.fields;

    const PATCH_AIRTABLE_RECORDS_URL = `${BACKEND_BASE_URL}/table/${id}/${symbol}/${allTimeVisits}/${losingPositions}/${gainingPositions}`;

    try {
        const patchRecordsResponse = await axios.patch(PATCH_AIRTABLE_RECORDS_URL);

        if (!patchRecordsResponse.data.records) {
            console.log("Error when issuing PATCH request to the Airtable records");
        }
    } catch (error) {
        console.log(error);
    }
};

export {
    fetchAirtableRecords,
    postAirtableRecord,
    patchAirtableRecords
};
