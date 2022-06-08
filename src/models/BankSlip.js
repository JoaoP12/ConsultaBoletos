const BankSlipTypes = {
    CONVENIO: 1,
    TITULO: 2
}

class BankSlip {
    constructor(writableLine) {
        this.writableLine = writableLine;
        this._calculateType();
        this._calculateBarCode();
        this._calculateAmount();
        this._calculateExpirationDate();
    }

    _calculateType() {
        const lengthToType = { 47: BankSlipTypes.TITULO, 48: BankSlipTypes.CONVENIO };
        this.type = lengthToType[this.writableLine.length];
    }

    _calculateBarCode() {
        if (this.type === BankSlipTypes.TITULO) {
            this.barCode = this.writableLine.substr(0, 4) + this.writableLine.substr(32, 15) + this.writableLine.substr(4, 5) + this.writableLine.substr(10, 10) + this.writableLine.substr(21, 10);
            return;
        }

        this.barCode = this.writableLine.substr(0, 11) + this.writableLine.substr(12, 11) + this.writableLine.substr(24, 11) + this.writableLine.substr(36, 11);    
    }

    _calculateAmount() {
        if (this.type === BankSlipTypes.TITULO) {
            this.amount = parseFloat(this.barCode.substr(9, 10)) / 100;
            return;
        }
        this.amount = parseFloat(this.barCode.substr(4, 11)) / 100;
    }

    _calculateExpirationDate() {
        let year, month, day;
        if (this.type === BankSlipTypes.TITULO) {
            const baseDate = new Date("1997-10-07");
            baseDate.setDate(baseDate.getDate() + this._getDaysFromBarCode());

            year = baseDate.getUTCFullYear();
            month = baseDate.getUTCMonth() + 1;
            day = baseDate.getUTCDate();
        } else {
            year = parseInt(this.barCode.substr(19, 4));
            month = parseInt(this.barCode.substr(23, 2));
            day = parseInt(this.barCode.substr(25, 2));
        }
        
        this.expirationDate = this._formatDate(year, month, day);
    }

    _formatDate(year, month, day) {
        return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    }

    _getDaysFromBarCode() {
        return parseInt(this.barCode.substr(5, 4));
    }
}

module.exports = BankSlip;