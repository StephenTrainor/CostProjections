var express = require('express');
var router = express.Router();
var polygon = require('../api/polygon');

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

router.get("/:symbol", async (req, res, next) => {
    const polygonGetTickerSymbolsResponse = await polygon.fetchTickerSymbols(req.params.symbol);

    res.json(polygonGetTickerSymbolsResponse);
});


module.exports = router;
