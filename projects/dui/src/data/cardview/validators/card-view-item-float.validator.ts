
import { CardViewItemValidator } from '../interfaces';

export class CardViewItemFloatValidator implements CardViewItemValidator {

  message = 'CORE.CARDVIEW.VALIDATORS.FLOAT_VALIDATION_ERROR';

  isValid(value: any): boolean {
    return value === ''
      || !isNaN(parseFloat(value))
      && isFinite(value);
  }
}
