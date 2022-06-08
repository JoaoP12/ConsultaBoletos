function validateWritableLine(writableLine) {
    if (!validateWritableLineLength(writableLine)) {
        throw new InvalidBankSlipError(`O comprimento da linha digitável deve ser de 47 a 48 dígitos`);
    }

    if (!validateWritableLineContent(writableLine)) {
        throw new InvalidBankSlipError('A linha digitada deve conter apenas números');
    }

    if (!validateCheckDigits(writableLine)) {
        throw new InvalidBankSlipError('Dígitos verificadores incorretos');
    }
}

function validateWritableLineLength(writableLine) {
    return writableLine.length === 47 || writableLine.length === 48;
}

function validateWritableLineContent(writableLine) {
    return /^[0-9]+$/.test(writableLine);
}

function validateCheckDigits(writableLine) {
    if (writableLine.length === 48) {
        return _verifyDealershipCheckDigits(writableLine);
    }
    
    return _verifyBankBillCheckDigits(writableLine);
}

function _verifyBankBillCheckDigits(writableLine) {
    const checkDigitsPositions = [9, 20, 31];

    if (!_verifyDealershipCheckDigits(writableLine, checkDigitsPositions)) {
        return false;
    }

    const barCode = writableLine.substr(0, 4) + writableLine.substr(33, 15) + writableLine.substr(4, 5) + writableLine.substr(10, 10) + writableLine.substr(21, 10);
    const generalCheckDigit = _calculateCheckDigit(11, barCode);
    return writableLine[32] === generalCheckDigit;
}

function _verifyDealershipCheckDigits(writableLine, checkDigitsPositions=[11, 23, 35, 47]) {
    let calcCheckDigit, lastPosition = -1;

    for (let position of checkDigitsPositions) {
        calcCheckDigit = _calculateCheckDigit(10, writableLine.slice(lastPosition+1, position));
        lastPosition = position;

        if (writableLine[position] !== calcCheckDigit) {
            return false;
        }
    }

    return true;
}

function _calculateCheckDigit(divider, field) {
    let multipliers = { 2: 1, 1: 2};
    let nextMult = 2;

    if (divider === 11) {
        multipliers = { 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 2};
    }
    
    let numbersMultiplied = field.split('').reverse().map(num => {
        let result = parseInt(num) * nextMult;

        while (result > 9 && divider === 10) {
            result = String(result).split('').reduce((n1, n2) => parseInt(n1) + parseInt(n2));
        }

        nextMult = multipliers[nextMult];
        return result;
    });

    const sum = numbersMultiplied.reduce((n1, n2) => n1 + n2);
    const remainder = sum % divider;

    if (remainder === 0 && divider === 10) {
        return '0';
    }

    const checkDigit = divider - remainder;
    return String(checkDigit)[0];
}

class InvalidBankSlipError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidBankSlipError';
    }
}

module.exports = {
    validateWritableLine,
    validateWritableLineLength,
    validateWritableLineContent,
    validateCheckDigits
}
