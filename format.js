/*
 * Copyright © 2020 Carlos Henrique Reche
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * format
 * 
 * A tool to format the exhibition of numbers, dates and text strings.
 * 
 * @url https://github.com/carlosreche/format
 * @author Carlos Henrique Reche
 */
export const format = (() => {

  const defaultOptions = {
    number: {
      integerDigits:             null,
      thousandsSeparator:        '',
      decimalSeparator:          '.',
      decimalDigits:             null,
      decimalThousandsSeparator: '',
      round:                     false,
      prefix:                    '',
      suffix:                    ''
    },
    date: {
      pattern: null,
      fields:  {},
      prefix:  '',
      suffix:  ''
    },
    text: {
      trim:            false,
      edgeTrim:        false,
      upperCase:       false,
      lowerCase:       false,
      capitalize:      false,
      capitalizeWords: false,
      cutSize:         null,
      cutSuffix:       ' ...',
      cutWords:        false,
      prefix:          '',
      suffix:          ''
    }
  };

  const thisObject = function formatValue (value, options = {}) {
    if (value instanceof Date) {
      return thisObject.date(value, options);
    } else {
      return thisObject.number(value, options);
    }
  };

  thisObject.number = function formatNumber (number, options = {}) {
    let parsed = parseNumber(number);
    if (!parsed) {
      return Number.NaN;
    }
    let {integer, decimal, positive} = parsed;
    let {
      integerDigits,
      thousandsSeparator,
      decimalSeparator,
      decimalDigits,
      decimalThousandsSeparator,
      round,
      prefix,
      suffix
    } = {...defaultOptions.number, ...options};

    if (round) {
      if ((typeof decimalDigits !== 'number') || (decimalDigits < 0)) {
        decimalDigits = 0;
      } else {
        decimalDigits = parseInt(decimalDigits);
      }
      number   = parseFloat((positive ? '' : '-') + integer + '.' + decimal);
      const k  = Math.pow(10, decimalDigits);
      number   = Math.round(number * k) / k;
      parsed   = parseNumber(number);
      integer  = parsed.integer;
      decimal  = parsed.decimal;
      positive = (number === 0) ? true : parsed.positive; // avoid result "-0"
    }
    let intLength = integer.length;
    let decLength = decimal.length;
    if ((typeof integerDigits === 'number') && (integerDigits > intLength)) {
      integer = ('0').repeat(integerDigits - intLength) + integer;
    }
    if ((typeof thousandsSeparator === 'string') &&
          (thousandsSeparator !== '')) {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }
    if (typeof decimalDigits === 'number') {
      if (decimalDigits > decLength) {
        decimal += ('0').repeat(decimalDigits - decLength);
      } else if (decimalDigits < decLength) {
        decimal = (decimalDigits > 0) ?
                    decimal.substring(0, decimalDigits) : '';
      }
    }
    if ((typeof decimalThousandsSeparator === 'string') &&
          (decimalThousandsSeparator !== '')) {
      decimal =
        decimal.replace(/(?<=(?<!\d)(\d{3})+)\B/g, decimalThousandsSeparator);
    }
    return (prefix + (positive ? '' : '-') + integer +
            ((decimal == '') ? '' : (decimalSeparator + decimal)) + suffix);
  };

  thisObject.date = function formatDate (date, options = {}) {
    if (!(date instanceof Date)) {
      switch (typeof date) {
        case 'number':
          date = new Date(parseInt(date));
          break;
        case 'string':
          date = new Date(Date.parse(date));
          break;
        default:
          return null;
      }
    }
    let {
      pattern,
      fields,
      prefix,
      suffix
    } = {...defaultOptions.date, ...options};
    if (!pattern) {
      if (typeof options !== 'string') {
        return null;
      }
      pattern = options;
    }
    if (!fields) {
      fields = {};
    }
    const regexp = /\\.|yy(yy)?|mm?|dd?|hh?|ii?|ss?|v|z|\{[^\}]+\}/g;
    const callback = (match) => {
      switch (match[0]) {
        case '\\':
          return match[1];
        case '{':
          let fieldName     = match.substring(1, match.length - 1);
          let fieldCallback = fields[fieldName];
          return ((typeof fieldCallback === 'function') ?
                  fieldCallback(date) : '');
      }
      switch (match) {
        case 'yyyy': return date.getFullYear();
        case 'yy':   return String(date.getFullYear()).slice(-2);
        case 'mm':   return leadingZeros(2, (date.getMonth() + 1));
        case 'm':    return (date.getMonth() + 1);
        case 'dd':   return leadingZeros(2, date.getDate());
        case 'd':    return date.getDate();
        case 'hh':   return leadingZeros(2, date.getHours());
        case 'h':    return date.getHours();
        case 'ii':   return leadingZeros(2, date.getMinutes());
        case 'i':    return date.getMinutes();
        case 'ss':   return leadingZeros(2, date.getSeconds());
        case 's':    return date.getSeconds();
        case 'v':    return leadingZeros(3, date.getMilliseconds());
        case 'z':
          let value    = date.getTimezoneOffset() / 60;
          let absValue = Math.abs(value);
          let hours    = parseInt(absValue);
          let minutes  = parseInt((absValue - hours) * 60);
          return `${(value < 0) ? '-' : '+'}${leadingZeros(2, hours)}:${
                  leadingZeros(2, minutes)}`;
      }
    };
    return (prefix + pattern.replace(regexp, callback) + suffix);
  };

  thisObject.text = function formatText (text, options = {}) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    let {
      trim,
      edgeTrim,
      upperCase,
      lowerCase,
      capitalize,
      capitalizeWords,
      cutSize,
      cutSuffix,
      cutWords,
      prefix,
      suffix
    } = {...defaultOptions.text, ...options};

    if (trim) {
      text = text.trim().replace(/\s+/g, ' ');
    } else if (edgeTrim) {
      text = text.trim();
    }
    if (upperCase) {
      text = text.toUpperCase();
      // overrides "lowerCase", "capitalize" and "capitalizeWords"
    } else {
      if (lowerCase) {
        text = text.toLowerCase();
      }
      if (capitalizeWords) {
        text = text.replace(
                  /(^|\s)(\S)/g,
                  (all, border, letter) => (border + letter.toUpperCase()));
      } else if (capitalize) {
        text = text.replace(
                  /(^\s*)(\S)/,
                  (all, space, letter) => (space + letter.toUpperCase()));
      }
    }
    text = prefix + text + suffix;
    if (typeof cutSize !== 'number') {
      return text;
    }

    let textLength = text.length;
    if (textLength <= cutSize) {
      return textReturnOnCut(false, text, '', '');
    }

    if (typeof cutSuffix !== 'string') {
      cutSuffix = '';
    }
    cutSize -= cutSuffix.length;
    if (cutSize < 1) {
      cutSize = 1;
    }
    let textKept, textCut;
    if (cutWords) {
      textKept = text.substring(0, cutSize);
      textCut  = text.substring(cutSize);
    } else {
      const nonWords = '\\s.,:;?!(){}\\[\\]';
      let regexp = '^(.{0,' + (cutSize - 1) + '}[^' + nonWords + '])' +
                    '(?=[' + nonWords + ']|$)(.*)$';
      let match = text.match(new RegExp(regexp));
      if (match) {
        textKept = match[1];
        textCut  = match[2];
      } else {
        // attempts to match only the first word
        regexp = '^(.*?[^' + nonWords + '])' + '(?=[' + nonWords + ']|$)(.*)$';
        match = text.match(new RegExp(regexp));
        if (match) {
          textKept = match[1];
          textCut  = match[2];
        } else {
          textKept = text.substring(0, cutSize);
          textCut  = text.substring(cutSize);
        }
      }
    }
    return textReturnOnCut(true, textKept, textCut, cutSuffix);
  };

  // formatting helpers
  const parseNumber = (number) => {
    let parsed = (/^([+-\s]*)(\d*)(\.(\d*))?/).exec(number);
    if (!parsed) {
      return null;
    }
    if (!parsed[2]) {
      if (!parsed[4]) {
        return null;
      }
      parsed[2] = '0';
    } else if (!parsed[4]) {
      parsed[4] = '';
    }
    let positive;
    switch (parsed[1]) {
      case '':
        positive = true;
        break;
      case '-':
        positive = false;
        break;
      case '+':
        positive = true;
        break;
      default:
        const minus = parsed[1].match(/-/g);
        positive = !minus || ((minus.length % 2) == 0);
        break;
    }
    return {
      integer: parsed[2],
      decimal: parsed[4],
      positive: positive
    };
  };
  const leadingZeros = (totalDigits, number) => {
    number = String(number);
    let zeros = totalDigits - number.length;
    return ((zeros < 1) ? number : (('0').repeat(zeros) + number));
  };
  class CutText extends String {
    cutting;
    constructor (isCut, kept, cut, suffix) {
      super(kept + suffix);
      this.cutting = {isCut, kept, cut, suffix};
    }
  }

  // formatting setup
  thisObject.number.defaultOptions =
        function defaultNumberOptions (options = null) {
    if (options) {
      Object.assign(defaultOptions.number, options);
    }
    return {...defaultOptions.number};
  };
  thisObject.date.defaultOptions =
        function defaultDateOptions (options = null) {
    if (options) {
      Object.assign(defaultOptions.date, options);
    }
    return {...defaultOptions.date};
  };
  thisObject.text.defaultOptions =
        function defaultTextOptions (options = null) {
    if (options) {
      Object.assign(defaultOptions.text, options);
    }
    return {...defaultOptions.text};
  };
  let textReturnOnCut;
  thisObject.text.returnObjectOnCut = (returnObject = null) => {
    if (returnObject !== null) {
      if (returnObject) {
        textReturnOnCut =
          (isCut, kept, cut, suffix) => new CutText(isCut, kept, cut, suffix);
      } else {
        textReturnOnCut = (isCut, kept, cut, suffix) => (kept + suffix);
      }
    }
    return textReturnOnCut;
  };
  thisObject.text.returnObjectOnCut(true);

  /* It will register a format function for the objects of each respective
   * Javascript type (Number, Date and String), making it possible to
   * write a cleaner and more readable code.
   * 
   * However, keep in mind that using non-native prototype functions is not
   * a recommended pratice, since the code can go into unexpected behavior
   * in the future if the standards change. But it might not be an issue to 
   * mantain small projects though.
   */
  thisObject.registerPrototypes = function registerPrototypes() {
    Number.prototype.format = function(options = null) {
      return thisObject.number(this, options);
    };
    Date.prototype.format = function(options = null) {
      return thisObject.date(this, options);
    };
    String.prototype.format = function(options = null) {
      return thisObject.text(this, options);
    };
      Number.defaultFormatOptions = function(options = null) {
      thisObject.number.defaultOptions(options);
    };
    Date.defaultFormatOptions = function(options = null) {
      thisObject.date.defaultOptions(options);
    };
    String.defaultFormatOptions = function(options = null) {
      thisObject.text.defaultOptions(options);
    };
  };

  return thisObject;
})();

export default format;
