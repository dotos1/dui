import { DateFormat,DateFormatOptions,getActualDateTimeFormat } from './date-formatter';
import { NumberFormat,getActualNumberFormat } from './number-formatter';
import { DateParser } from './date-parser';
import { NumberParser } from './number-parser';
import { IntlBase } from './intl-base';
import { Base2,NumberFormatOptions } from './base';
import { extend, getValue } from '@dotos/dui/base';
import { Observer } from '@dotos/dui/base';
/**
 * Specifies the observer used for external change detection.
 */
export let onIntlChange: Observer = new Observer();
/**
 * Specifies the default rtl status for EJ2 components.
 */
export let rightToLeft: boolean = false;


/**
 * Specifies the CLDR data loaded for internationalization functionalities.
 * private
 */
export let cldrData: Object = {};

const mapper: string[] = ['numericObject', 'dateObject'];
/**
 * Internationalization class provides support to parse and format the number and date object to the desired format.
 * ```typescript
 * // To set the culture globally
 * setCulture('en-GB');
 *
 * // To set currency code globally
 * setCurrencyCode('EUR');
 *
 * //Load cldr data
 * loadCldr(gregorainData);
 * loadCldr(timeZoneData);
 * loadCldr(numbersData);
 * loadCldr(numberSystemData);
 *
 * // To use formatter in component side
 * let Intl:Internationalization = new Internationalization();
 *
 * // Date formatting
 * let dateFormatter: Function = Intl.getDateFormat({skeleton:'long',type:'dateTime'});
 * dateFormatter(new Date('11/2/2016'));
 * dateFormatter(new Date('25/2/2030'));
 * Intl.formatDate(new Date(),{skeleton:'E'});
 *
 * //Number formatting
 * let numberFormatter: Function = Intl.getNumberFormat({skeleton:'C5'})
 * numberFormatter(24563334);
 * Intl.formatNumber(123123,{skeleton:'p2'});
 *
 * // Date parser
 * let dateParser: Function = Intl.getDateParser({skeleton:'short',type:'time'});
 * dateParser('10:30 PM');
 * Intl.parseDate('10',{skeleton:'H'});
 * ```
 */
export class Internationalization {
  public culture: string;
  constructor(cultureName?: string) {
    if (cultureName) {
      this.culture = cultureName;
    }
  }

  public getDateFormat(options?: DateFormatOptions): Function {
    return DateFormat.dateFormat( options || { type: 'date', skeleton: 'short' }, cldrData);
  }

  public getNumberFormat(options?: NumberFormatOptions): Function {
    if (options && !options.currency) {
      options.currency = Base2.defaultCurrencyCode;
    }
    return NumberFormat.numberFormatter( options || {}, cldrData);
  }

  public getDateParser(options?: DateFormatOptions): Function {
    return DateParser.dateParser(options || { skeleton: 'short', type: 'date' }, cldrData);
  }

  public getNumberParser(options?: NumberFormatOptions): Function {
    return NumberParser.numberParser(options || { format: 'N' }, cldrData);
  }

  public formatNumber(value: Number, option?: NumberFormatOptions): string {
    return this.getNumberFormat(option)(value);
  }

  public formatDate(value: Date, option?: DateFormatOptions): string {
    return this.getDateFormat(option)(value);
  }
  /**
   * Returns the date object for given date string and options.
   * param {string} value - Specifies the string to parse.
   * param {DateFormatOptions} option - Specifies the parse options in which the date string will be parsed.
   * returns {Date}
   */
  public parseDate(value: string, option?: DateFormatOptions): Date {
    return this.getDateParser(option)(value);
  }
  /**
   * Returns the number object from the given string value and options.
   * param {string} value - Specifies the string to parse.
   * param {NumberFormatOptions} option - Specifies the parse options in which the  string number  will be parsed.
   * returns {number}
   */
  public parseNumber(value: string, option?: NumberFormatOptions): number {
    return this.getNumberParser(option)(value);
  }
  /**
   * Returns Native Date Time Pattern
   * param {DateFormatOptions} option - Specifies the parse options for resultant date time pattern.
   * param {boolean} isExcelFormat - Specifies format value to be converted to excel pattern.
   * returns {string}
   * private
   */
  public getDatePattern(option: DateFormatOptions, isExcelFormat?: boolean): string {
    return getActualDateTimeFormat( option, cldrData, isExcelFormat);
  }
  /**
   * Returns Native Number Pattern
   * param {NumberFormatOptions} option - Specifies the parse options for resultant number pattern.
   * returns {string}
   * private
   */
  public getNumberPattern(option: NumberFormatOptions): string {
    return getActualNumberFormat( option, cldrData);
  }
  /**
   * Returns the First Day of the Week
   * returns {number}
   */
  public getFirstDayOfWeek(): number {
    return IntlBase.getWeekData( cldrData);
  }
  private getCulture(): string {
    return this.culture || Base2.defaultCulture;
  }
}

/**
 * Set the default culture to all EJ2 components
 * param {string} cultureName - Specifies the culture name to be set as default culture.
 */
export function setCulture(cultureName: string): void {
  Base2.defaultCulture = cultureName;
  onIntlChange.notify('notifyExternalChange', { 'locale': Base2.defaultCulture });
}

/**
 * Set the default currency code to all EJ2 components
 * param {string} currencyCode Specifies the culture name to be set as default culture.
 * returns {void}
 */
export function setCurrencyCode(currencyCode: string): void {
  Base2.defaultCurrencyCode = currencyCode;
  onIntlChange.notify('notifyExternalChange', { 'currencyCode': Base2.defaultCurrencyCode });
}
/**
 * Load the CLDR data into context
 * param {Object[]} obj Specifies the CLDR data's to be used for formatting and parser.
 * returns {void}
 */
export function loadCldr(...data: Object[]): void {
  for (let obj of data) {
    extend(cldrData, obj, {}, true);
  }
}



export function enableRtl(status: boolean = true): void {
  rightToLeft = status;
  onIntlChange.notify('notifyExternalChange', { enableRtl: rightToLeft });
}

/**
 * To get the numeric CLDR object for given culture
 * param {string} locale - Specifies the locale for which numericObject to be returned.
 * @ignore
 * private
 */
export function getNumericObject(locale: string, type?: string): Object {
  /* tslint:disable no-any */
  let numObject: Object = (<any>Base2.getDependables(cldrData,  '', true))[mapper[0]];
  let dateObject: Object = (<any>Base2.getDependables(cldrData,  ''))[mapper[1]];
  let numSystem: string = getValue('defaultNumberingSystem', numObject);
  let symbPattern: Object = getValue('symbols-numberSystem-' + numSystem, numObject);
  let pattern: string = IntlBase.getSymbolPattern(type || 'decimal', numSystem, numObject, false);
  return extend(symbPattern, IntlBase.getFormatData(pattern, true, '', true), { 'dateSeparator': IntlBase.getDateSeparator(dateObject) });
}

/**
 * To get the numeric CLDR  number base object for given culture
 * param {string} locale - Specifies the locale for which numericObject to be returned.
 * param {string} currency - Specifies the currency for which numericObject to be returned.
 * @ignore
 * private
 */
export function getNumberDependable(locale: string, currency: string): string {
  let numObject: Object = (<any>Base2.getDependables(cldrData,  '', true));
  return Base2.getCurrencySymbol((<any>numObject).numericObject, currency);
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDefaultDateObject(mode?: string): Object {
  return (<any>Base2.getDependables(cldrData,  '', false))[mapper[1]];
}
