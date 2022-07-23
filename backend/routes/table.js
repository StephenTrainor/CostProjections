var express = require('express');
var router = express.Router();
var airtable = require('../api/airtable');

router.get("/", async (req, res, next) => {
    const airtableGetRecordsResponse = await airtable.fetchAllAirtableRecords();

    res.json(airtableGetRecordsResponse);
});

router.post("/:symbol/:allTimeVisits/:losingPositions/:gainingPositions", async (req, res, next) => {
    const {
        symbol,
        allTimeVisits,
        losingPositions,
        gainingPositions,
    } = req.params;

    const airtablePostParams = {
        records: [{
            fields: {
                symbol: symbol,
                allTimeVisits: allTimeVisits,
                losingPositions: losingPositions,
                gainingPositions: gainingPositions
            }
        }],
        typecast: true
    };   

    const airtablePostRecordResponse = await airtable.postAirtableRecord(airtablePostParams);

    res.json(airtablePostRecordResponse);
});

router['patch']("/:id/:symbol/:allTimeVisits/:losingPositions/:gainingPositions", async (req, res, next) => {
    const {
        id,
        symbol,
        allTimeVisits,
        losingPositions,
        gainingPositions,
    } = req.params;

    const airtablePatchParams = {
        records: [{
            id: id,
            fields: {
                symbol: symbol,
                allTimeVisits: allTimeVisits,
                losingPositions: losingPositions,
                gainingPositions: gainingPositions
            },
        }],
        typecast: true
    };

    const airtablePatchRecordResponse = await airtable.patchAirtableRecord(airtablePatchParams);

    res.json(airtablePatchRecordResponse);
});

module.exports = router;
