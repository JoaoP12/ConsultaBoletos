const express = require('express');
const { processBankSlip } = require('./src/controllers/BankSlipController')
const { checkWritableLine } = require('./src/middlewares/bankSlipMiddleware');

const router = express.Router();

router.get("/boleto/:writableLine", checkWritableLine, processBankSlip);

module.exports = router;