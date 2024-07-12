import { isUndefined, throwError, isNullOrUndefined, extend } from '@dotos/dui/base';
import { Base2,NumberFormatOptions } from './base';
import { IntlBase as base } from './intl-base';
import { ParserBase as parser, NumberMapper } from './parser-base';

/**
 * Interface for common formatting options
 */
export interface CommonOptions {
  numberMapper?: NumberMapper;
  currencySymbol?: string;
  percentSymbol?: string;
  minusSymbol?: string;
}
/**
 * Interface for currency processing
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CurrencyOptions {
  position?: string;
  symbol?: string;
  currencySpace?: boolean;
}
/**
 * interface for Numeric Formatting Parts
 */
export interface NumericParts {
  symbolRegex?: RegExp;
  nData?: Base2.NegativeData;
  pData?: Base2.NegativeData;
  infinity?: string;
  type?: string;
  fractionDigits?: number;
  isAccount?: boolean;
  custom?: boolean;
}
const errorText: Object = {
  'ms': 'minimumSignificantDigits',
  'ls': 'maximumSignificantDigits',
  'mf': 'minimumFractionDigits',
  'lf': 'maximumFractionDigits',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const integerError: string = 'minimumIntegerDigits';
const percentSign: string = 'percentSign';
const minusSign: string = 'minusSign';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const spaceRegex: RegExp = /\s/;
const mapper: string[] = ['infinity', 'nan', 'group', 'decimal', 'exponential'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const infinity: string = 'infinity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nan: string = 'nan';
/**
 * Module for number formatting.
 * private
 */
export class NumberFormat {
  /**
   * Returns the formatter function for given skeleton.
   * param {string} culture -  Specifies the culture name to be which formatting.
   * param {NumberFormatOptions} option - Specific the format in which number  will format.
   * param {Object} object- Specifies the global cldr data collection.
   * return Function.
   */
  public static numberFormatter(option: NumberFormatOptions, cldr: Object): Function {
    let fOptions: Base2.FormatParts = extend({}, option);
    let cOptions: Base2.GenericFormatOptions = {};
    let dOptions: CommonOptions = {};
    let symbolPattern: string;
    let dependable: Base2.Dependables = Base2.getDependables(cldr,  '', true);
    dOptions.numberMapper = parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr), true);
    dOptions.currencySymbol = Base2.getCurrencySymbol(
      dependable.numericObject, fOptions.currency || Base2.defaultCurrencyCode);
    /* tslint:disable no-any */
    dOptions.percentSymbol = (<any>dOptions).numberMapper.numberSymbols[percentSign];
    dOptions.minusSymbol = (<any>dOptions).numberMapper.numberSymbols[minusSign];
    let symbols: any = dOptions.numberMapper.numberSymbols;
    if ((option.format) && !(base.formatRegex.test(option.format))) {
      cOptions = customFormat(option.format, dOptions, dependable.numericObject);
    } else {
      extend(fOptions, base.getProperNumericSkeleton(option.format || 'N'));
      fOptions.isCurrency = fOptions.type === 'currency';
      fOptions.isPercent = fOptions.type === 'percent';
      symbolPattern = base.getSymbolPattern(
        fOptions.type, dOptions.numberMapper.numberSystem, dependable.numericObject, fOptions.isAccount);
      fOptions.groupOne = this.checkValueRange(fOptions.maximumSignificantDigits, fOptions.minimumSignificantDigits, true);
      this.checkValueRange(fOptions.maximumFractionDigits, fOptions.minimumFractionDigits, false, true);
      if (!isUndefined(fOptions.fractionDigits)) {
        fOptions.minimumFractionDigits = fOptions.maximumFractionDigits = fOptions.fractionDigits;
      }
      if (isUndefined(fOptions.useGrouping)) {
        fOptions.useGrouping = true;
      }
      if (fOptions.isCurrency) {
        symbolPattern = symbolPattern.replace(/\u00A4/g, base.defaultCurrency);
      }
      let split: string[] = symbolPattern.split(';');
      cOptions.nData = base.getFormatData(split[1] || '-' + split[0], true, dOptions.currencySymbol);
      cOptions.pData = base.getFormatData(split[0], false, dOptions.currencySymbol);
      if (fOptions.useGrouping) {
        fOptions.groupSeparator = symbols[mapper[2]];
        fOptions.groupData = this.getGroupingDetails(split[0]);
      }
      let minFrac: boolean = isUndefined(fOptions.minimumFractionDigits);
      if (minFrac) {
        fOptions.minimumFractionDigits = cOptions.nData.minimumFraction;
      }
      if (isUndefined(fOptions.maximumFractionDigits)) {
        let mval: number = cOptions.nData.maximumFraction;
        fOptions.maximumFractionDigits = isUndefined(mval) && fOptions.isPercent ? 0 : mval;
      }
      let mfrac: number = fOptions.minimumFractionDigits;
      let lfrac: number = fOptions.maximumFractionDigits;
      if (!isUndefined(mfrac) && !isUndefined(lfrac)) {
        if (mfrac > lfrac) {
          fOptions.maximumFractionDigits = mfrac;
        }
      }
    }
    extend(cOptions.nData, fOptions);
    extend(cOptions.pData, fOptions);
    return (value: number): string => {
      if (isNaN(value)) {
        return symbols[mapper[1]];
      } else if (!isFinite(value)) {
        return symbols[mapper[0]];
      }
      return this.intNumberFormatter(value, cOptions, dOptions);
    };
  }
  /**
   * Returns grouping details for the pattern provided
   * param {string} pattern
   * returns {GroupDetails}
   */
  public static getGroupingDetails(pattern: string): Base2.GroupDetails {
    let ret: Base2.GroupDetails = {};
    let match: string[] = pattern.match(base.negativeDataRegex);
    if (match && match[4]) {
      let pattern: string = match[4];
      let p: number = pattern.lastIndexOf(',');
      if (p !== -1) {
        let temp: string = pattern.split('.')[0];
        ret.primary = (temp.length - p) - 1;
        let s: number = pattern.lastIndexOf(',', p - 1);
        if (s !== -1) {
          ret.secondary = p - 1 - s;
        }
      }
    }
    return ret;
  }
  /**
   * Returns if the provided integer range is valid.
   * param {number} val1
   * param {number} val2
   * param {boolean} checkbothExist
   * param {boolean} isFraction
   * returns {boolean}
   */
  private static checkValueRange(val1: number, val2: number, checkbothExist: boolean, isFraction?: true): boolean {
    let decide: string = isFraction ? 'f' : 's';
    let dint: number = 0;
    let str1: string = (<any>errorText)['l' + decide];
    let str2: string = (<any>errorText)['m' + decide];
    if (!isUndefined(val1)) {
      this.checkRange(val1, str1, isFraction);
      dint++;
    }
    if (!isUndefined(val2)) {
      this.checkRange(val2, str2, isFraction);
      dint++;
    }
    if (dint === 2) {
      if (val1 < val2) {
        throwError(str2 + 'specified must be less than the' + str1);
      } else {
        return true;
      }
    } else if (checkbothExist && dint === 1) {
      throwError('Both' + str2 + 'and' + str2 + 'must be present');
    }
    return false;
  }
  /**
   * Check if the provided fraction range is valid
   * param {number} val
   * param {string} text
   * param {boolean} isFraction
   * returns {void}
   */
  private static checkRange(val: number, text: string, isFraction?: boolean): void {
    let range: number[] = isFraction ? [0, 20] : [1, 21];
    if (val < range[0] || val > range[1]) {
      throwError(text + 'value must be within the range' + range[0] + 'to' + range[1]);
    }
  }
  /**
   * Returns formatted numeric string for provided formatting options
   * param {number} value
   * param {base.GenericFormatOptions} fOptions
   * param {CommonOptions} dOptions
   * returns {string}
   */
  private static intNumberFormatter(value: number, fOptions: Base2.GenericFormatOptions, dOptions: CommonOptions): string {
    let curData: Base2.NegativeData;
    if (isUndefined(fOptions.nData.type)) {
      return undefined;
    } else {
      if (value < 0) {
        value = value * -1;
        curData = fOptions.nData;
      } else if (value === 0) {
        curData = fOptions.zeroData || fOptions.pData;
      } else {
        curData = fOptions.pData;
      }
      let fValue: string = '';
      if (curData.isPercent) {
        value = value * 100;
      }
      if (curData.groupOne) {
        fValue = this.processSignificantDigits(value, curData.minimumSignificantDigits, curData.maximumSignificantDigits);
      } else {
        fValue = this.processFraction(value, curData.minimumFractionDigits, curData.maximumFractionDigits);
        if (curData.minimumIntegerDigits) {
          fValue = this.processMinimumIntegers(fValue, curData.minimumIntegerDigits);
        }
      }
      if (curData.type === 'scientific') {
        fValue = value.toExponential(curData.maximumFractionDigits);
        fValue = fValue.replace('e', dOptions.numberMapper.numberSymbols[mapper[4]]);
      }
      fValue = fValue.replace('.', (<any>dOptions).numberMapper.numberSymbols[mapper[3]]);
      if (curData.useGrouping) {
        fValue = this.groupNumbers(
          fValue, curData.groupData.primary, curData.groupSeparator || ',',
          (<any>dOptions).numberMapper.numberSymbols[mapper[3]] || '.', curData.groupData.secondary);
      }
      fValue = parser.convertValueParts(fValue, base.latnParseRegex, dOptions.numberMapper.mapper);
      if (curData.nlead === 'N/A') {
        return curData.nlead;
      } else {
        return curData.nlead + fValue + curData.nend;
      }
    }
  }
  /**
   * Returns significant digits processed numeric string
   * param {number} value
   * param {number} min
   * param {number} max
   * returns {string}
   */
  private static processSignificantDigits(value: number, min: number, max: number): string {
    let temp: string = value + '';
    let tn: number;
    let length: number = temp.length;
    if (length < min) {
      return value.toPrecision(min);
    } else {
      temp = value.toPrecision(max);
      tn = +temp;
      return tn + '';
    }
  }
  /**
   * Returns grouped numeric string
   * param {string} val
   * param {number} level1
   * param {string} sep
   * param {string} decimalSymbol
   * param {number} level2
   * returns {string}
   */
  private static groupNumbers(val: string, level1: number, sep: string, decimalSymbol: string, level2?: number): string {
    let flag: boolean = !isNullOrUndefined(level2) && level2 !== 0;
    let split: string[] = val.split(decimalSymbol);
    let prefix: string = split[0];
    let length: number = prefix.length;
    let str: string = '';
    while (length > level1) {
      str = prefix.slice(length - level1, length) + (str.length ?
        (sep + str) : '');
      length -= level1;
      if (flag) {
        level1 = level2;
        flag = false;
      }
    }
    split[0] = prefix.slice(0, length) + (str.length ? sep : '') + str;
    return split.join(decimalSymbol);
  }
  /**
   * Returns fraction processed numeric string
   * param {number} value
   * param {number} min
   * param {number} max
   * returns {string}
   */
  private static processFraction(value: number, min: number, max: number): string {
    let temp: string = (value + '').split('.')[1];
    let length: number = temp ? temp.length : 0;
    if (min && length < min) {
      let ret: string = '';
      if (length === 0) {
        ret = value.toFixed(min);
      } else {
        ret += value;
        for (let j: number = 0; j < min - length; j++) {
          ret += '0';
        }
        return ret;
      }
      return value.toFixed(min);
    } else if (!isNullOrUndefined(max) && (length > max || max === 0)) {
      return value.toFixed(max);
    }
    return value + '';
  }
  /**
   * Returns integer processed numeric string
   * param {string} value
   * param {number} min
   * returns {string}
   */
  private static processMinimumIntegers(value: string, min: number): string {
    let temp: string[] = value.split('.');
    let lead: string = temp[0];
    let len: number = lead.length;
    if (len < min) {
      for (let i: number = 0; i < min - len; i++) {
        lead = '0' + lead;
      }
      temp[0] = lead;
    }
    return temp.join('.');
  }

}
 /**
   * Returns Native Number pattern
   * param {NumberFormatOptions} options
   * param {Object} cldr
   * returns {string}
   */
  export function getActualNumberFormat(options: NumberFormatOptions, cldr?: Object): string {
    let dependable: Base2.Dependables = Base2.getDependables(cldr,  '', true);
    let parseOptions: NumericParts = { custom: true };
    let minFrac: number;
    let curObj: Base2.GenericFormatOptions & { hasNegativePattern?: boolean } = {};
    let curMatch: string[] = (options.format || '').match(base.currencyFormatRegex);
    if (curMatch) {
      let dOptions: CommonOptions = {};
      dOptions.numberMapper = parser.getNumberMapper(dependable.parserObject, parser.getNumberingSystem(cldr), true);
      let curCode: string = Base2.getCurrencySymbol(dependable.numericObject, options.currency || Base2.defaultCurrencyCode);
      let symbolPattern: string = base.getSymbolPattern(
        'currency', dOptions.numberMapper.numberSystem, dependable.numericObject, (/a/i).test(options.format));
      symbolPattern = symbolPattern.replace(/\u00A4/g, curCode);
      let split: string[] = symbolPattern.split(';');
      curObj.hasNegativePattern = (split.length > 1);
      curObj.nData = base.getFormatData(split[1] || '-' + split[0], true, curCode);
      curObj.pData = base.getFormatData(split[0], false, curCode);
      if (!curMatch[2] && !options.minimumFractionDigits && !options.maximumFractionDigits) {
        minFrac = base.getFormatData(symbolPattern.split(';')[0], true, '', true).minimumFraction;
      }
    }
    let actualPattern: string;
    if ((base.formatRegex.test(options.format)) || !(options.format)) {
      extend(parseOptions, base.getProperNumericSkeleton(options.format || 'N'));
      parseOptions.custom = false;
      actualPattern = '###0';
      if (parseOptions.fractionDigits || options.minimumFractionDigits || options.maximumFractionDigits || minFrac) {
        let defaultMinimum: number = 0;
        if (parseOptions.fractionDigits) {
          options.minimumFractionDigits = options.maximumFractionDigits = parseOptions.fractionDigits;
        }
        actualPattern = base.fractionDigitsPattern(
          actualPattern, minFrac || parseOptions.fractionDigits ||
          options.minimumFractionDigits || defaultMinimum,
          options.maximumFractionDigits || defaultMinimum);
      }
      if (options.minimumIntegerDigits) {
        actualPattern = base.minimumIntegerPattern(actualPattern, options.minimumIntegerDigits);
      }
      if (options.useGrouping) {
        actualPattern = base.groupingPattern(actualPattern);
      }
      if (parseOptions.type === 'currency') {
        let cPattern: string = actualPattern;
        actualPattern = curObj.pData.nlead + cPattern + curObj.pData.nend;
        if (curObj.hasNegativePattern) {
          actualPattern += ';' + curObj.nData.nlead + cPattern + curObj.nData.nend;
        }
      }
      if (parseOptions.type === 'percent') {
        actualPattern += ' %';
      }
    } else {
      actualPattern = options.format.replace(/\'/g, '"');
    }
    return actualPattern;
  }

  /**
   * Returns formatting options for custom number format
   * private
   * param {string} format
   * param {CommonOptions} dOptions
   * param {Dependables} obj
   * returns {GenericFormatOptions}
   */
  export function customFormat(format: string, dOptions: CommonOptions, obj: Base2.Dependables): Base2.GenericFormatOptions {
    let options: Base2.GenericFormatOptions = {};
    let formatSplit: string[] = format.split(';');
    let data: string[] = ['pData', 'nData', 'zeroData'];
    for (let i: number = 0; i < formatSplit.length; i++) {
      (<any>options)[data[i]] = customNumberFormat(formatSplit[i], dOptions, obj);
    }
    if (isNullOrUndefined(options.nData)) {
      options.nData = extend({}, options.pData);
      options.nData.nlead = isNullOrUndefined(dOptions) ? '-' + options.nData.nlead : dOptions.minusSymbol + options.nData.nlead;
    }
    return options;
  }
  /**
   * Returns custom formatting options
   * private
   * param {string} format
   * param {CommonOptions} dOptions
   * param {Object} numObject
   * returns {NegativeData}
   */
  function customNumberFormat(format: string, dOptions?: CommonOptions, numObject?: Object): Base2.NegativeData {
    let cOptions: Base2.NegativeData = { type: 'decimal', minimumFractionDigits: 0, maximumFractionDigits: 0 };
    let pattern: string[] = format.match(base.customRegex);
    if (isNullOrUndefined(pattern) || (pattern[5] === '' && format !== 'N/A')) {
      cOptions.type = undefined;
    }
    cOptions.nlead = pattern[1];
    cOptions.nend = pattern[10];
    let integerPart: string = pattern[6];
    cOptions.useGrouping = integerPart.indexOf(',') !== -1;
    integerPart = integerPart.replace(/,/g, '');
    let fractionPart: string = pattern[7];
    if (integerPart.indexOf('0') !== -1) {
      cOptions.minimumIntegerDigits = integerPart.length - integerPart.indexOf('0');
    }
    if (!isNullOrUndefined(fractionPart)) {
      cOptions.minimumFractionDigits = fractionPart.lastIndexOf('0');
      cOptions.maximumFractionDigits = fractionPart.lastIndexOf('#');
      if (cOptions.minimumFractionDigits === -1) {
        cOptions.minimumFractionDigits = 0;
      }
      if (cOptions.maximumFractionDigits === -1 || cOptions.maximumFractionDigits < cOptions.minimumFractionDigits) {
        cOptions.maximumFractionDigits = cOptions.minimumFractionDigits;
      }
    }
    if (!isNullOrUndefined(dOptions)) {
      extend(cOptions, base.isCurrencyPercent([cOptions.nlead, cOptions.nend], '$', dOptions.currencySymbol));
      if (!cOptions.isCurrency) {
        extend(cOptions, base.isCurrencyPercent(
          [cOptions.nlead, cOptions.nend], '%', dOptions.percentSymbol));
      }
    } else {
      extend(cOptions, base.isCurrencyPercent([cOptions.nlead, cOptions.nend], '%', '%'));
    }
    if (!isNullOrUndefined(numObject)) {
      let symbolPattern: string = base.getSymbolPattern(
        cOptions.type, dOptions.numberMapper.numberSystem, numObject, false);
      if (cOptions.useGrouping) {
        cOptions.groupSeparator = (<any>dOptions).numberMapper.numberSymbols[mapper[2]];
        cOptions.groupData = NumberFormat.getGroupingDetails(symbolPattern.split(';')[0]);
      }
      cOptions.nlead = cOptions.nlead.replace(/\'/g, '');
      cOptions.nend = cOptions.nend.replace(/\'/g, '');
    }
    return cOptions;
  }
