var express = require('express');
var router = express.Router();
var airtable = require('../api/airtable');

router.get("/", async (req, res, next) => {
    const airtableGetResponse = await airtable.fetchAllAirtableFields();

    res.json(airtableGetResponse);
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

    const airtablePostResponse = await airtable.postAirtableRecord(airtablePostParams);

    res.json(airtablePostResponse);
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

    const airtablePatchResponse = await airtable.patchAirtableField(airtablePatchParams);

    res.json(airtablePatchResponse);
});

module.exports = router;
