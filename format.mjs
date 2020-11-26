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
 * 
 * 
 * 
 * @url https://github.com/carlosreche/format
 * @author Carlos Henrique Reche
 */
export const format = (() => {

  const format = (value, options = {}) => {
    if (value instanceof Date) {
      return format.date(value, options);
    } else {
      return format.number(value, options);
    }
  };

  format.setup = (() => {

    const setup = {};

    const defaults = {
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
        trim:             false,
        clearExtraSpaces: false,
        upperCase:        false,
        lowerCase:        false,
        capitalize:       false,
        capitalizeWords:  false,
        truncateSize:     null,
        truncateSuffix:   ' ...',
        truncateWords:    false,
        prefix:           '',
        suffix:           ''
      }
    };

    setup.defaultNumber = function defaultNumber(options = null) {
      if (options) {
        Object.assign(defaults.number, options);
      }
      return {... defaults.number};
    };

    setup.defaultDate = function defaultDate(options = null) {
      if (options) {
        Object.assign(defaults.date, options);
      }
      return {... defaults.date};
    };

    setup.defaultText = function defaultText(options = null) {
      if (options) {
        Object.assign(defaults.text, options);
      }
      return {... defaults.text};
    };

    return setup;
  })();

  format.number = function formatNumber(number, options = {}) {
    const parse = (number) => {
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
        case '':  positive = true; break;
        case '-': positive = false; break;
        case '+': positive = true; break;
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
    }
    
    let parsed = parse(number);
    if (!parsed) {
      return Number.NaN;
    }
    let {integer, decimal, positive} = parsed;
    let {
      integerDigits             = null,
      thousandsSeparator        = '',
      decimalSeparator          = '.',
      decimalDigits             = null,
      decimalThousandsSeparator = '',
      round                     = false,
      prefix                    = '',
      suffix                    = ''
    } = Object.assign(format.setup.defaultNumber(), options);

    if (round) {
      if ((typeof decimalDigits !== 'number') || (decimalDigits < 0)) {
        decimalDigits = 0;
      } else {
        decimalDigits = parseInt(decimalDigits);
      }
      number   = parseFloat((positive ? '' : '-') + integer + '.' + decimal);
      const k  = Math.pow(10, decimalDigits);
      number   = Math.round(number * k) / k;
      parsed   = parse(number);
      integer  = parsed.integer;
      decimal  = parsed.decimal;
      positive = (number === 0) ? true : parsed.positive; // avoid result "-0"
    }
    let intLength = integer.length, decLength = decimal.length;
    if ((typeof integerDigits === 'number') && (integerDigits > intLength)) {
      integer = ('0').repeat(integerDigits - intLength) + integer;
    }
    if ((typeof thousandsSeparator === 'string') && (thousandsSeparator !== '')) {
      integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
    }
    if (typeof decimalDigits === 'number') {
      if (decimalDigits > decLength) {
        decimal += ('0').repeat(decimalDigits - decLength);
      } else if (decimalDigits < decLength) {
        decimal = (decimalDigits > 0) ? decimal.substr(0, decimalDigits) : '';
      }
    }
    if ((typeof decimalThousandsSeparator === 'string') &&
          (decimalThousandsSeparator !== '')
    ) {
      decimal = decimal.replace(/(?<=(?<!\d)(\d{3})+)\B/g, decimalThousandsSeparator);
    }

    return (
      prefix + (positive ? '' : '-') + integer + 
      ((decimal == '') ? '' : (decimalSeparator + decimal)) + suffix
    );
  };

  format.date = function formatDate(date, options = {}) {
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
      pattern = null,
      fields   = {},
      prefix  = '',
      suffix  = ''
    } = Object.assign(format.setup.defaultDate(), options);
    if (!pattern) {
      if (typeof options !== 'string') {
        return null;
      }
      pattern = options;
    }
    if (!fields) {
      fields = {};
    }

    const leadingZeros = (totalDigits, number) => {
      let zeros = totalDigits - String(number).length;
      return ((zeros < 0) ? number : (('0').repeat(zeros) + number));
    }
    const regexp = /\\.|yy(yy)?|mm?|dd?|hh?|ii?|ss?|v|z|\{[^\}]+\}/g;
    const callback = (match) => {
      switch (match[0]) {
        case '\\':
          return match[1];
        case '{':
          let fieldName = match.substr(1, match.length - 2);
          let callback  = fields[fieldName];
          return ((typeof callback === 'function') ? callback(date) : '');
        default:
          break;
      }
      switch (match) {
        case 'yyyy': return date.getFullYear();
        case 'yy':   return String(date.getFullYear()).substr(-2);
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

        default:
          break;
      }
    };
    return (prefix + pattern.replace(regexp, callback) + suffix);
  };

  format.text = function formatText(text, options = {}) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    let {
      trim             = false,
      clearExtraSpaces = false,
      upperCase        = false,
      lowerCase        = false,
      capitalize       = false,
      capitalizeWords  = false,
      truncateSize     = null,
      truncateSuffix   = ' ...',
      truncateWords    = false,
      prefix           = '',
      suffix           = ''
    } = Object.assign(format.setup.defaultText(), options);

    if (clearExtraSpaces) {
      text = text.trim().replace(/\s+/g, ' ');
    } else if (trim) {
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
        text = text.replace(/(^|\s)(\S)/g, (all, border, letter) => (border + letter.toUpperCase()));
      } else if (capitalize) {
        text = text.replace(/(^\s*)(\S)/, (all, space, letter) => (space + letter.toUpperCase()));
      }
    }

    if ((typeof truncateSize === 'number') && (truncateSize > 0)) {
      let textLength = text.length;
      if (textLength > truncateSize) {
        let suffixLength = truncateSuffix.length;
        let newTextLength = truncateSize - suffixLength;
        if (newTextLength < 1) {
          newTextLength = 1;
        }
        if (truncateWords) {
          text = text.substr(0, newTextLength) + truncateSuffix;
        } else {
          const regexp = '^(.{0,' + (newTextLength - 1) + '}[^\\s.,:;?!])(?=[\\s.,:;?!]|$)';
          const match  = text.match(new RegExp(regexp));
          if (match) {
            text = match[1] + truncateSuffix;
          } else {
            text = text.substr(0, newTextLength) + truncateSuffix;
          }
        }
      }
    }
    return (prefix + text + suffix);
  };
  format.text.adjustName = function adjustName(name, lowerCases = []) {
    if (typeof name !== 'string') {
      name = String(name);  
    }
    name = name.trim().replace(/\s+/g, ' ').toLowerCase();
    const pattern = '(^|[ ´`\'])' +
                      ((Array.isArray(lowerCases) && (lowerCases.length > 0)) ?
                        ('(?!(?:' + lowerCases.join('|') + ')(?: |$))') : '') +
                    '(\\S)';
    const callback = (all, border, letter) => (border + letter.toUpperCase());
    return name.replace(new RegExp(pattern, 'g'), callback);
  };


  /* It will register a format function for the objects of each respective
   * Javascript type (Number, Date and String), making it possible to
   * write a cleaner and more readable code.
   * 
   * However, keep in mind that using non-native prototype functions is not
   * a recommended pratice, since the code can go into unexpected behavior
   * in the future if the standards change. But it might not be an issue to 
   * mantain small projects though.
   */
  format.prototype = function prototype() {
    Number.prototype.format = function(options) {
      return format.number(this, options);
    };
    Date.prototype.format = function(options) {
      return format.date(this, options);
    };
    String.prototype.format = function(options) {
      return format.text(this, options);
    };
  };

  return format;
})();

export default format;
