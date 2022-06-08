const { validateWritableLine } = require('../utils/validators/bankSlipValidator');

function checkWritableLine(req, res, next) {
    const { writableLine } = req.params;
    try {
        validateWritableLine(writableLine);
        next();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    checkWritableLine
}