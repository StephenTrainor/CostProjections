var express = require('express');
var router = express.Router();
var iex = require('../api/iex');

router.get("/:symbol", async (req, res, next) => {
    const response = await iex.stockQuote(req.params.symbol);

    res.json(response);
});

module.exports = router;
