
export class DecimalNumberModel {
    minIntegerDigits: number;
    minFractionDigits: number;
    maxFractionDigits: number;

    constructor(obj?: any) {
        if (obj) {
            this.minIntegerDigits = obj.minIntegerDigits;
            this.minFractionDigits = obj.minFractionDigits;
            this.maxFractionDigits = obj.maxFractionDigits;
        }
    }
}
