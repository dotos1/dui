/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-namespace */
import { Base2} from './base';
import { getValue, isNullOrUndefined } from '@dotos/dui/base';
import { ParserBase } from './parser-base';
/**
 * Date base common constants and function for date parser and formatter.
 */

 export interface Dependables {
  parserObject?: Object;
  dateObject?: Object;
  numericObject?: Object;
}
export namespace IntlBase {
  // tslint:disable-next-line:max-line-length
  export const negativeDataRegex: RegExp = /^(('[^']+'|''|[^*#@0,.E])*)(\*.)?((([#,]*[0,]*0+)(\.0*[0-9]*#*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
  export const customRegex: RegExp = /^(('[^']+'|''|[^*#@0,.])*)(\*.)?((([0#,]*[0,]*[0#]*)(\.[0#]*)?)|([#,]*@+#*))(E\+?0+)?(('[^']+'|''|[^*#@0,.E])*)$/;
  export const latnParseRegex: RegExp = /0|1|2|3|4|5|6|7|8|9/g;
  const fractionRegex: RegExp = /[0-9]/g;
  export const defaultCurrency: string = '$';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mapper: string[] = ['infinity', 'nan', 'group', 'decimal'];
  export const patternRegex: RegExp = /G|M|L|H|c|'| a|yy|y|EEEE|E/g;
  export const patternMatch: Object = {
    'G': '',
    'M': 'm',
    'L': 'm',
    'H': 'h',
    'c': 'd',
    '\'': '"',
    ' a': ' AM/PM',
    'yy': 'yy',
    'y': 'yyyy',
    'EEEE': 'dddd',
    'E': 'ddd'
  };
  const defaultFirstDay: string = 'sun';
  export const islamicRegex: RegExp = /^islamic/;
  const firstDayMapper: Object = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
  };

  export const defaultObject: Object = {
    'dates': {
        'calendars': {
            'gregorian': {
                'months': {
                    'stand-alone': {
                        'abbreviated': {
                            '1': 'Jan',
                            '2': 'Feb',
                            '3': 'Mar',
                            '4': 'Apr',
                            '5': 'May',
                            '6': 'Jun',
                            '7': 'Jul',
                            '8': 'Aug',
                            '9': 'Sep',
                            '10': 'Oct',
                            '11': 'Nov',
                            '12': 'Dec'
                        },
                        'narrow': {
                            '1': 'J',
                            '2': 'F',
                            '3': 'M',
                            '4': 'A',
                            '5': 'M',
                            '6': 'J',
                            '7': 'J',
                            '8': 'A',
                            '9': 'S',
                            '10': 'O',
                            '11': 'N',
                            '12': 'D'
                        },
                        'wide': {
                            '1': 'January',
                            '2': 'February',
                            '3': 'March',
                            '4': 'April',
                            '5': 'May',
                            '6': 'June',
                            '7': 'July',
                            '8': 'August',
                            '9': 'September',
                            '10': 'October',
                            '11': 'November',
                            '12': 'December'
                        }
                    }
                },
                'days': {
                    'stand-alone': {
                        'abbreviated': {
                            'sun': 'Sun',
                            'mon': 'Mon',
                            'tue': 'Tue',
                            'wed': 'Wed',
                            'thu': 'Thu',
                            'fri': 'Fri',
                            'sat': 'Sat'
                        },
                        'narrow': {
                            'sun': 'S',
                            'mon': 'M',
                            'tue': 'T',
                            'wed': 'W',
                            'thu': 'T',
                            'fri': 'F',
                            'sat': 'S'
                        },
                        'short': {
                            'sun': 'Su',
                            'mon': 'Mo',
                            'tue': 'Tu',
                            'wed': 'We',
                            'thu': 'Th',
                            'fri': 'Fr',
                            'sat': 'Sa'
                        },
                        'wide': {
                            'sun': 'Sunday',
                            'mon': 'Monday',
                            'tue': 'Tuesday',
                            'wed': 'Wednesday',
                            'thu': 'Thursday',
                            'fri': 'Friday',
                            'sat': 'Saturday'
                        }
                    }
                },
                'dayPeriods': {
                    'format': {
                        'wide': {
                            'am': 'AM',
                            'pm': 'PM'
                        }
                    }
                },
                'eras': {
                    'eraNames': {
                        '0': 'Before Christ',
                        '0-alt-variant': 'Before Common Era',
                        '1': 'Anno Domini',
                        '1-alt-variant': 'Common Era'
                    },
                    'eraAbbr': {
                        '0': 'BC',
                        '0-alt-variant': 'BCE',
                        '1': 'AD',
                        '1-alt-variant': 'CE'
                    },
                    'eraNarrow': {
                        '0': 'B',
                        '0-alt-variant': 'BCE',
                        '1': 'A',
                        '1-alt-variant': 'CE'
                    }
                },
                'dateFormats': {
                    'full': 'EEEE, MMMM d, y',
                    'long': 'MMMM d, y',
                    'medium': 'MMM d, y',
                    'short': 'M/d/yy'
                },
                'timeFormats': {
                    'full': 'h:mm:ss a zzzz',
                    'long': 'h:mm:ss a z',
                    'medium': 'h:mm:ss a',
                    'short': 'h:mm a'
                },
                'dateTimeFormats': {
                    'full': '{1} \'at\' {0}',
                    'long': '{1} \'at\' {0}',
                    'medium': '{1}, {0}',
                    'short': '{1}, {0}',
                    'availableFormats': {
                        'd': 'd',
                        'E': 'ccc',
                        'Ed': 'd E',
                        'Ehm': 'E h:mm a',
                        'EHm': 'E HH:mm',
                        'Ehms': 'E h:mm:ss a',
                        'EHms': 'E HH:mm:ss',
                        'Gy': 'y G',
                        'GyMMM': 'MMM y G',
                        'GyMMMd': 'MMM d, y G',
                        'GyMMMEd': 'E, MMM d, y G',
                        'h': 'h a',
                        'H': 'HH',
                        'hm': 'h:mm a',
                        'Hm': 'HH:mm',
                        'hms': 'h:mm:ss a',
                        'Hms': 'HH:mm:ss',
                        'hmsv': 'h:mm:ss a v',
                        'Hmsv': 'HH:mm:ss v',
                        'hmv': 'h:mm a v',
                        'Hmv': 'HH:mm v',
                        'M': 'L',
                        'Md': 'M/d',
                        'MEd': 'E, M/d',
                        'MMM': 'LLL',
                        'MMMd': 'MMM d',
                        'MMMEd': 'E, MMM d',
                        'MMMMd': 'MMMM d',
                        'ms': 'mm:ss',
                        'y': 'y',
                        'yM': 'M/y',
                        'yMd': 'M/d/y',
                        'yMEd': 'E, M/d/y',
                        'yMMM': 'MMM y',
                        'yMMMd': 'MMM d, y',
                        'yMMMEd': 'E, MMM d, y',
                        'yMMMM': 'MMMM y'
                    }
                }
            },
            'islamic': {
                'months': {
                    'stand-alone': {
                        'abbreviated': {
                            '1': 'Muh.',
                            '2': 'Saf.',
                            '3': 'Rab. I',
                            '4': 'Rab. II',
                            '5': 'Jum. I',
                            '6': 'Jum. II',
                            '7': 'Raj.',
                            '8': 'Sha.',
                            '9': 'Ram.',
                            '10': 'Shaw.',
                            '11': 'Dhuʻl-Q.',
                            '12': 'Dhuʻl-H.'
                        },
                        'narrow': {
                            '1': '1',
                            '2': '2',
                            '3': '3',
                            '4': '4',
                            '5': '5',
                            '6': '6',
                            '7': '7',
                            '8': '8',
                            '9': '9',
                            '10': '10',
                            '11': '11',
                            '12': '12'
                        },
                        'wide': {
                            '1': 'Muharram',
                            '2': 'Safar',
                            '3': 'Rabiʻ I',
                            '4': 'Rabiʻ II',
                            '5': 'Jumada I',
                            '6': 'Jumada II',
                            '7': 'Rajab',
                            '8': 'Shaʻban',
                            '9': 'Ramadan',
                            '10': 'Shawwal',
                            '11': 'Dhuʻl-Qiʻdah',
                            '12': 'Dhuʻl-Hijjah'
                        }
                    }
                },
                'days': {
                    'stand-alone': {
                        'abbreviated': {
                            'sun': 'Sun',
                            'mon': 'Mon',
                            'tue': 'Tue',
                            'wed': 'Wed',
                            'thu': 'Thu',
                            'fri': 'Fri',
                            'sat': 'Sat'
                        },
                        'narrow': {
                            'sun': 'S',
                            'mon': 'M',
                            'tue': 'T',
                            'wed': 'W',
                            'thu': 'T',
                            'fri': 'F',
                            'sat': 'S'
                        },
                        'short': {
                            'sun': 'Su',
                            'mon': 'Mo',
                            'tue': 'Tu',
                            'wed': 'We',
                            'thu': 'Th',
                            'fri': 'Fr',
                            'sat': 'Sa'
                        },
                        'wide': {
                            'sun': 'Sunday',
                            'mon': 'Monday',
                            'tue': 'Tuesday',
                            'wed': 'Wednesday',
                            'thu': 'Thursday',
                            'fri': 'Friday',
                            'sat': 'Saturday'
                        }
                    }
                },
                'dayPeriods': {
                    'format': {
                        'wide': {
                            'am': 'AM',
                            'pm': 'PM'
                        }
                    }
                },
                'eras': {
                    'eraNames': {
                        '0': 'AH'
                    },
                    'eraAbbr': {
                        '0': 'AH'
                    },
                    'eraNarrow': {
                        '0': 'AH'
                    }
                },
                'dateFormats': {
                    'full': 'EEEE, MMMM d, y G',
                    'long': 'MMMM d, y G',
                    'medium': 'MMM d, y G',
                    'short': 'M/d/y GGGGG'
                },
                'timeFormats': {
                    'full': 'h:mm:ss a zzzz',
                    'long': 'h:mm:ss a z',
                    'medium': 'h:mm:ss a',
                    'short': 'h:mm a'
                },
                'dateTimeFormats': {
                    'full': '{1} \'at\' {0}',
                    'long': '{1} \'at\' {0}',
                    'medium': '{1}, {0}',
                    'short': '{1}, {0}',
                    'availableFormats': {
                        'd': 'd',
                        'E': 'ccc',
                        'Ed': 'd E',
                        'Ehm': 'E h:mm a',
                        'EHm': 'E HH:mm',
                        'Ehms': 'E h:mm:ss a',
                        'EHms': 'E HH:mm:ss',
                        'Gy': 'y G',
                        'GyMMM': 'MMM y G',
                        'GyMMMd': 'MMM d, y G',
                        'GyMMMEd': 'E, MMM d, y G',
                        'h': 'h a',
                        'H': 'HH',
                        'hm': 'h:mm a',
                        'Hm': 'HH:mm',
                        'hms': 'h:mm:ss a',
                        'Hms': 'HH:mm:ss',
                        'M': 'L',
                        'Md': 'M/d',
                        'MEd': 'E, M/d',
                        'MMM': 'LLL',
                        'MMMd': 'MMM d',
                        'MMMEd': 'E, MMM d',
                        'MMMMd': 'MMMM d',
                        'ms': 'mm:ss',
                        'y': 'y G',
                        'yyyy': 'y G',
                        'yyyyM': 'M/y GGGGG',
                        'yyyyMd': 'M/d/y GGGGG',
                        'yyyyMEd': 'E, M/d/y GGGGG',
                        'yyyyMMM': 'MMM y G',
                        'yyyyMMMd': 'MMM d, y G',
                        'yyyyMMMEd': 'E, MMM d, y G',
                        'yyyyMMMM': 'MMMM y G',
                        'yyyyQQQ': 'QQQ y G',
                        'yyyyQQQQ': 'QQQQ y G'
                    }
                }
            }
        },
        'timeZoneNames': {
            'hourFormat': '+HH:mm;-HH:mm',
            'gmtFormat': 'GMT{0}',
            'gmtZeroFormat': 'GMT'
        }
    },
    'numbers': {
        'currencies': {
            'USD': {
                'displayName': 'US Dollar',
                'symbol': '$',
                'symbol-alt-narrow': '$'
            },
            'EUR': {
                'displayName': 'Euro',
                'symbol': '€',
                'symbol-alt-narrow': '€'
            },
            'GBP': {
                'displayName': 'British Pound',
                'symbol-alt-narrow': '£'
            }
        },
        'defaultNumberingSystem': 'latn',
        'minimumGroupingDigits': '1',
        'symbols-numberSystem-latn': {
            'decimal': '.',
            'group': ',',
            'list': ';',
            'percentSign': '%',
            'plusSign': '+',
            'minusSign': '-',
            'exponential': 'E',
            'superscriptingExponent': '×',
            'perMille': '‰',
            'infinity': '∞',
            'nan': 'NaN',
            'timeSeparator': ':'
        },
        'decimalFormats-numberSystem-latn': {
            'standard': '#,##0.###'
        },
        'percentFormats-numberSystem-latn': {
            'standard': '#,##0%'
        },
        'currencyFormats-numberSystem-latn': {
            'standard': '¤#,##0.00',
            'accounting': '¤#,##0.00;(¤#,##0.00)'
        },
        'scientificFormats-numberSystem-latn': {
            'standard': '#E0'
        }
    }
};
  export interface GroupSize {
    primary?: number;
    secondary?: number;
  }

  export const formatRegex: RegExp = /(^[ncpae]{1})([0-1]?[0-9]|20)?$/i;
  export const currencyFormatRegex: RegExp = /(^[ca]{1})([0-1]?[0-9]|20)?$/i;
  export const curWithoutNumberRegex: RegExp = /(c|a)$/ig;
  const typeMapper: Object = {
    '$': 'isCurrency',
    '%': 'isPercent',
    '-': 'isNegative',
    0: 'nlead',
    1: 'nend'
  };
  export const dateParseRegex: RegExp = /([a-z])\1*|'([^']|'')+'|''|./gi;
  export const basicPatterns: string[] = ['short', 'medium', 'long', 'full'];


  /* tslint:enable:quotemark */
  export const monthIndex: Object = {
    3: 'abbreviated',
    4: 'wide',
    5: 'narrow',
    1: 'abbreviated'
  };
  /**
   *
   */

  export const month: string = 'months';
  export const days: string = 'days';
  /**
   * Default numerber Object
   */

  export const patternMatcher: { [key: string]: Object } = {
    C: 'currency',
    P: 'percent',
    N: 'decimal',
    A: 'currency',
    E: 'scientific'
  };

  export function getDependables(cldr: Object, culture: string, mode: string, isNumber?: boolean): Dependables {
    const ret: Dependables = {};
    const calendartype: string = mode || 'gregorian';
    ret.parserObject = ParserBase.getMainObject(cldr) ||  defaultObject;
    if (isNumber) {
        ret.numericObject = getValue('numbers', ret.parserObject);
    } else {
        const dateString: string = 'dates.calendars.' + calendartype;
        ret.dateObject = getValue(dateString, ret.parserObject);
    }
    return ret;
}
  /**
   * Returns the symbol pattern for provided parameters
   * private
   * param {string} type
   * param {string} numSystem
   * param {Object} obj
   * param {boolean} isAccount
   * returns {string}
   */
  export function getSymbolPattern(type: string, numSystem: string, obj: Object, isAccount: boolean): string {
    return getValue(
      type + 'Formats-numberSystem-' +
      numSystem + (isAccount ? '.accounting' : '.standard'),
      obj) || (isAccount ? getValue(
        type + 'Formats-numberSystem-' +
        numSystem + '.standard',
        obj) : '');
  }
  /**
   * Returns proper numeric skeleton
   * private
   * param {string} skeleton
   * returns {NumericSkeleton}
   */
  export function getProperNumericSkeleton(skeleton: string): Base2.NumericSkeleton {
    let matches: RegExpMatchArray = skeleton.match(formatRegex);
    let ret: Base2.NumericSkeleton = {};
    let pattern: string = matches[1].toUpperCase();
    ret.isAccount = (pattern === 'A');
    /* tslint:disable no-any */
    (<any>ret).type = patternMatcher[pattern];
    if (skeleton.length > 1) {
      ret.fractionDigits = parseInt(matches[2], 10);
    }
    return ret;
  }
  /**
   * Returns format data for number formatting like minimum fraction, maximum fraction, etc..,
   * private
   * param {string} pattern
   * param {boolean} needFraction
   * param {string} cSymbol
   * param {boolean} fractionOnly
   * returns {NegativeData}
   */
  export function getFormatData(pattern: string, needFraction: boolean, cSymbol: string, fractionOnly?: boolean): Base2.NegativeData {
    let nData: Base2.NegativeData = fractionOnly ? {} : { nlead: '', nend: '' };
    let match: string[] = pattern.match(customRegex);
    if (match) {
      if (!fractionOnly) {
        nData.nlead = changeCurrencySymbol(match[1], cSymbol);
        nData.nend = changeCurrencySymbol(match[10], cSymbol);
        nData.groupPattern = match[4];
      }
      let fraction: string = match[7];
      if (fraction && needFraction) {
        let fmatch: string[] = fraction.match(fractionRegex);
        if (!isNullOrUndefined(fmatch)) {
          nData.minimumFraction = fmatch.length;
        } else {
          nData.minimumFraction = 0;
        }
        nData.maximumFraction = fraction.length - 1;
      }

    }
    return nData;
  }
  /**
   * Changes currency symbol
   * private
   * param {string} val
   * param {string} sym
   * returns {string}
   */
  function changeCurrencySymbol(val: string, sym: string): string {
    if (val) {
      return val.replace(defaultCurrency, sym);
    }
    return '';
  }



  /**
   * Returns formatting options for currency or percent type
   * private
   * param {string[]} parts
   * param {string} actual
   * param {string} symbol
   * returns {NegativeData}
   */
  export function isCurrencyPercent(parts: string[], actual: string, symbol: string): Base2.NegativeData {
    let options: Base2.NegativeData = { nlead: parts[0], nend: parts[1] };
    for (let i: number = 0; i < 2; i++) {
      let part: string = parts[i];
      let loc: number = part.indexOf(actual);
      if ((loc !== -1) && ((loc < part.indexOf('\'')) || (loc > part.lastIndexOf('\'')))) {
        (<any>options)[(<any>typeMapper)[i]] = part.substr(0, loc) + symbol + part.substr(loc + 1);
        (<any>options)[(<any>typeMapper)[actual]] = true;
        options.type = options.isCurrency ? 'currency' : 'percent';
        break;
      }
    }
    return options;
  }
  /**
   * Returns culture based date separator
   * private
   * param {Object} dateObj
   * returns {string}
   */
  export function getDateSeparator(dateObj: Object): string {
    let value: string[] = (getValue('dateFormats.short', dateObj) || '').match(/[d‏M‏]([^d‏M])[d‏M‏]/i);
    return value ? value[1] : '/';
  }

  export function fractionDigitsPattern(pattern: string, minDigits: number, maxDigits?: number): string {
    pattern += '.';
    for (let a: number = 0; a < minDigits; a++) {
      pattern += '0';
    }
    if (minDigits < maxDigits) {
      let diff: number = maxDigits - minDigits;
      for (let b: number = 0; b < diff; b++) {
        pattern += '#';
      }
    }
    return pattern;
  }
  export function minimumIntegerPattern(pattern: string, digits: number): string {
    let temp: string[] = pattern.split('.');
    let integer: string = '';
    for (let x: number = 0; x < digits; x++) {
      integer += '0';
    }
    return temp[1] ? (integer + '.' + temp[1]) : integer;
  }
  export function groupingPattern(pattern: string): string {
    let temp: string[] = pattern.split('.');
    let integer: string = temp[0];
    let no: number = 3 - integer.length % 3;
    let hash: string = (no && no === 1) ? '#' : (no === 2 ? '##' : '');
    integer = hash + integer;
    pattern = '';
    for (let x: number = integer.length - 1; x > 0; x = x - 3) {
      pattern = ',' + integer[x - 2] + integer[x - 1] + integer[x] + pattern;
    }
    pattern = pattern.slice(1);
    return temp[1] ? (pattern + '.' + temp[1]) : pattern;
  }
  export function getWeekData( cldr?: Object): number {
    let firstDay: string = defaultFirstDay;
    let mapper: Object = getValue('supplemental.weekData.firstDay', cldr);

    return firstDayMapper[firstDay];
  }
}
