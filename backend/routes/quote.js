var express = require('express');
var router = express.Router();
var iexCloud = require('../api/iexCloud');

router.get("/:symbol", async (req, res, next) => {
    const iexCloudGetStockQuoteResponse = await iexCloud.fetchStockQuote(req.params.symbol);

    res.json(iexCloudGetStockQuoteResponse);
});

module.exports = router;
