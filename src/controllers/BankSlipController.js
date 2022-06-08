const BankSlip = require('../models/BankSlip');

async function processBankSlip(req, res) {
    const { writableLine } = req.params;
    const { barCode, amount, expirationDate } = new BankSlip(writableLine);
    return res.status(200).json({
        barCode: barCode,
        amount: `${amount.toFixed(2)}`,
        expirationDate: expirationDate        
    });
}

module.exports = {
    processBankSlip,
}