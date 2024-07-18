/* eslint-disable @typescript-eslint/no-namespace */
import { getValue } from '@dotos/dui/base';

export interface NumberFormatOptions {
    /**
     * Specifies minimum fraction digits in formatted value.
     */
    minimumFractionDigits?: number;
    /**
     * Specifies maximum fraction digits in formatted value.
     */
    maximumFractionDigits?: number;
    /**
     * Specifies minimum significant digits in formatted value.
     */
    minimumSignificantDigits?: number;
    /**
     * Specifies maximum significant digits in formatted value.
     */
    maximumSignificantDigits?: number;
    /**
     * Specifies whether to use grouping or not in formatted value,
     */
    useGrouping?: boolean;
    /**
     * Specifies the skeleton for perform formatting.
     */
    skeleton?: string;
    /**
     * Specifies the currency code to be used for formatting.
     */
    currency?: string;
    /**
     * Specifies minimum integer digits in formatted value.
     */
    minimumIntegerDigits?: number;
    /**
     * Specifies custom number format for formatting.
     */
    format?: string;
}
export namespace Base2 {
    /**
     * Specifies default currency code to be considered
     * private
     */
    export let defaultCurrencyCode: string = 'USD';

    export let defaultCulture: string = 'en-US';
    /* tslint:disable:quotemark */
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
                    "days": {
                        "stand-alone": {
                            "abbreviated": {
                                "sun": "Sun",
                                "mon": "Mon",
                                "tue": "Tue",
                                "wed": "Wed",
                                "thu": "Thu",
                                "fri": "Fri",
                                "sat": "Sat"
                            },
                            "narrow": {
                                "sun": "S",
                                "mon": "M",
                                "tue": "T",
                                "wed": "W",
                                "thu": "T",
                                "fri": "F",
                                "sat": "S"
                            },
                            "short": {
                                "sun": "Su",
                                "mon": "Mo",
                                "tue": "Tu",
                                "wed": "We",
                                "thu": "Th",
                                "fri": "Fr",
                                "sat": "Sa"
                            },
                            "wide": {
                                "sun": "Sunday",
                                "mon": "Monday",
                                "tue": "Tuesday",
                                "wed": "Wednesday",
                                "thu": "Thursday",
                                "fri": "Friday",
                                "sat": "Saturday"
                            }
                        }
                    },
                    "dayPeriods": {
                        "format": {
                            "wide": {
                                "am": "AM",
                                "pm": "PM"
                            }
                        }
                    },
                    'eras': {
                        'eraNames': {
                            '0': 'Before Christ',
                            '0-alt-variant': 'Before Common Era',
                            '1': 'Anno Domini',
                            "1-alt-variant": "Common Era"
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
                        'full': "{1} 'at' {0}",
                        'long': "{1} 'at' {0}",
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
                            'yMMMM': 'MMMM y',
                        },
                    }
                },
                "islamic": {
                    "months": {
                        "stand-alone": {
                            "abbreviated": {
                                "1": "Muh.",
                                "2": "Saf.",
                                "3": "Rab. I",
                                "4": "Rab. II",
                                "5": "Jum. I",
                                "6": "Jum. II",
                                "7": "Raj.",
                                "8": "Sha.",
                                "9": "Ram.",
                                "10": "Shaw.",
                                "11": "Dhuʻl-Q.",
                                "12": "Dhuʻl-H."
                            },
                            "narrow": {
                                "1": "1",
                                "2": "2",
                                "3": "3",
                                "4": "4",
                                "5": "5",
                                "6": "6",
                                "7": "7",
                                "8": "8",
                                "9": "9",
                                "10": "10",
                                "11": "11",
                                "12": "12"
                            },
                            "wide": {
                                "1": "Muharram",
                                "2": "Safar",
                                "3": "Rabiʻ I",
                                "4": "Rabiʻ II",
                                "5": "Jumada I",
                                "6": "Jumada II",
                                "7": "Rajab",
                                "8": "Shaʻban",
                                "9": "Ramadan",
                                "10": "Shawwal",
                                "11": "Dhuʻl-Qiʻdah",
                                "12": "Dhuʻl-Hijjah"
                            }
                        }
                    },
                    "days": {
                        "stand-alone": {
                            "abbreviated": {
                                "sun": "Sun",
                                "mon": "Mon",
                                "tue": "Tue",
                                "wed": "Wed",
                                "thu": "Thu",
                                "fri": "Fri",
                                "sat": "Sat"
                            },
                            "narrow": {
                                "sun": "S",
                                "mon": "M",
                                "tue": "T",
                                "wed": "W",
                                "thu": "T",
                                "fri": "F",
                                "sat": "S"
                            },
                            "short": {
                                "sun": "Su",
                                "mon": "Mo",
                                "tue": "Tu",
                                "wed": "We",
                                "thu": "Th",
                                "fri": "Fr",
                                "sat": "Sa"
                            },
                            "wide": {
                                "sun": "Sunday",
                                "mon": "Monday",
                                "tue": "Tuesday",
                                "wed": "Wednesday",
                                "thu": "Thursday",
                                "fri": "Friday",
                                "sat": "Saturday"
                            }
                        }
                    },
                    "dayPeriods": {
                        "format": {
                            "wide": {
                                "am": "am",
                                "pm": "PM"
                            }
                        }
                    },
                    "eras": {
                        "eraNames": {
                            "0": "AH"
                        },
                        "eraAbbr": {
                            "0": "AH"
                        },
                        "eraNarrow": {
                            "0": "AH"
                        }
                    },
                    "dateFormats": {
                        "full": "EEEE, MMMM d, y G",
                        "long": "MMMM d, y G",
                        "medium": "MMM d, y G",
                        "short": "M/d/y GGGGG"
                    },
                    "timeFormats": {
                        "full": "h:mm:ss a zzzz",
                        "long": "h:mm:ss a z",
                        "medium": "h:mm:ss a",
                        "short": "h:mm a"
                    },
                    "dateTimeFormats": {
                        "full": "{1} 'at' {0}",
                        "long": "{1} 'at' {0}",
                        "medium": "{1}, {0}",
                        "short": "{1}, {0}",
                        "availableFormats": {
                            "d": "d",
                            "E": "ccc",
                            "Ed": "d E",
                            "Ehm": "E h:mm a",
                            "EHm": "E HH:mm",
                            "Ehms": "E h:mm:ss a",
                            "EHms": "E HH:mm:ss",
                            "Gy": "y G",
                            "GyMMM": "MMM y G",
                            "GyMMMd": "MMM d, y G",
                            "GyMMMEd": "E, MMM d, y G",
                            "h": "h a",
                            "H": "HH",
                            "hm": "h:mm a",
                            "Hm": "HH:mm",
                            "hms": "h:mm:ss a",
                            "Hms": "HH:mm:ss",
                            "M": "L",
                            "Md": "M/d",
                            "MEd": "E, M/d",
                            "MMM": "LLL",
                            "MMMd": "MMM d",
                            "MMMEd": "E, MMM d",
                            "MMMMd": "MMMM d",
                            "ms": "mm:ss",
                            "y": "y G",
                            "yyyy": "y G",
                            "yyyyM": "M/y GGGGG",
                            "yyyyMd": "M/d/y GGGGG",
                            "yyyyMEd": "E, M/d/y GGGGG",
                            "yyyyMMM": "MMM y G",
                            "yyyyMMMd": "MMM d, y G",
                            "yyyyMMMEd": "E, MMM d, y G",
                            "yyyyMMMM": "MMMM y G",
                            "yyyyQQQ": "QQQ y G",
                            "yyyyQQQQ": "QQQQ y G"
                        }
                    }
                }
            },
            'timeZoneNames': {
                "hourFormat": "+HH:mm;-HH:mm",
                "gmtFormat": "GMT{0}",
                "gmtZeroFormat": "GMT",
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
                    'symbol': '',
                    'symbol-alt-narrow': ''
                },
                'GBP': {
                    'displayName': 'British Pound',
                    'symbol-alt-narrow': '£'
                },
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
                'perMille': '',
                'infinity': '∞',
                'nan': 'NaN',
                'timeSeparator': ':'
            },
            'decimalFormats-numberSystem-latn': {
                'standard': '#,##0.###',
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

    export interface Dependables {
        parserObject?: Object;
        dateObject?: Object;
        numericObject?: Object;
    }
    export interface NumericSkeleton {
        type?: string;
        isAccount?: boolean;
        fractionDigits?: number;
    }

    /**
    * Interface for default formatting options
    * private
    */
    export interface FormatParts extends NumericSkeleton, NumberFormatOptions {
        groupOne?: boolean;
        isPercent?: boolean;
        isCurrency?: boolean;
        isNegative?: boolean;
        groupData?: GroupDetails;
        groupSeparator?: string;
    }
    export interface NegativeData extends FormatParts {
        nlead?: string;
        nend?: string;
        groupPattern?: string;
        minimumFraction?: number;
        maximumFraction?: number;
    }
    export interface GenericFormatOptions {
        nData?: NegativeData;
        pData?: NegativeData;
        zeroData?: NegativeData;
    }
    /**
      * Interface for grouping process
      */
    export interface GroupDetails {
        primary?: number;
        secondary?: number;
    }


    export interface TimeZoneOptions {
        hourFormat?: string;
        gmtFormat?: string;
        gmtZeroFormat?: string;
      }

      export interface DateObject {
        year?: number;
        month?: number;
        date?: number;
      }


    export function getDependables(cldr: Object,  mode: string, isNumber?: boolean): Dependables {
        let ret: Dependables = {};
        let calendartype: string = mode || 'gregorian';
        ret.parserObject = cldr['main'] || defaultObject;
        if (isNumber) {
            ret.numericObject = getValue('numbers', ret.parserObject);
        } else {
            ret.dateObject = getValue('dates.calendars.' + calendartype, ret.parserObject);
        }
        return ret;
    }

    export function getCurrencySymbol(numericObject: Object, currencyCode: string): string {
        return getValue('currencies.' + currencyCode + '.symbol', numericObject) || '$';
    }
}
