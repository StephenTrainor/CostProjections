var express = require('express');
var router = express.Router();
var polygon = require('../api/polygon');

router.get("/:symbol", async (req, res, next) => {
    const response = await polygon.getSymbols(req.params.symbol);

    res.json(response);
});


module.exports = router;
