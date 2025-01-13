

import { CardViewItemValidator } from '../interfaces';

export class CardViewItemIntValidator implements CardViewItemValidator {

  message = 'CORE.CARDVIEW.VALIDATORS.INT_VALIDATION_ERROR';

  isValid(value: any): boolean {
    return value === ''
      || !isNaN(value)
      && this.isIntegerNumber(value);
  }

  isIntegerNumber(value: any): boolean {
    const parsedNumber = parseFloat(value);
    return (parsedNumber | 0) === parsedNumber;
  }
}
