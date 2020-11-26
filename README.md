# format

A simple, nifty and full-featured Javascript formatter of numbers, dates and text strings.

## Quick View

### Formatting Numbers

```js
console.log(format.number(1000.5, {
    decimalDigits:      2,
    decimalSeparator:   ',',
    thousandsSeparator: '.'
  }
));
// output: "1.000,50"
```

### Formatting Dates
```js
console.log(format.date(new Date('2020-09-05 16:15:00'), {
    pattern: '{abbrMonth} dd, yyyy',
    fields: {
      abbrMonth: date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    }
  }
));
// output: "Sep 05, 2020"
```

### Formatting Texts
```js
let messedUpText = '   the QUICK browN fox jumps     OVER the lazy dog';
console.log(format.text(messedUpText, {
    clearExtraSpaces: true,
    toLowerCase:      true,
    capitalizeWords:  true,
    truncateSize:     35,
    truncateSuffix:   ' ...'
  }
));
// output: "The Quick Brown Fox Jumps Over ..."
// (final length = 34)
```

---

## Library Reference

### format.number&nbsp;_(&nbsp;value,&nbsp;options&nbsp;)_

#### **_value_** : Number | String

Can be a number or any valid numeric string.

#### **_options_** : Object

Should be an object having any of the properties below:

| Property | Description | Expected Type | Default Value |
|----------|--------------|:-------------:|:-------------:|
| integerDigits | Ensure the integer part of the number has at least as many digits as specified here, by appending leading zeros to it, if it's necessary. | Number | null |
| decimalDigits | Ensure the decimal part of the number has exactly the same digits specified here, by adding right zeros to it or by cropping the excess.<br>Notice that if the property _**round**_ is _true_, the number will firstly be rounded to the last decimal digit (specified here) before cropping. | Number | null |
| decimalSeparator | The character separating the integer part from the decimal one. | String | "." <br>_(dot)_ |
| thousandsSeparator | The character delimiting each thousand multiple of the integer part (for example, the commas in _1,000,000_&nbsp;). | String | "&nbsp;" <br>_(empty string)_ |
| decimalThousandsSeparator | The character delimiting each thousand multiple of the decimal part (for example, the spaces in _0.000&nbsp;100&nbsp;250_&nbsp;, making it easier to read _100 micro_ and _250 nano_). | String | "&nbsp;" <br>_(empty string)_ |
| round | Sets whether the number should be rounded or not. When rounding, the value set in _**decimalDigits**_ will be observed  (for example, if _decimalDigits_ equals _2_, rounding the number _0.7899_ will result in _0.79_&nbsp;, not _1_ as someone could imagine). | Boolean | false |
| prefix | Appends a value at the beggining of the formatted number. | String | "&nbsp;" <br>_(empty string)_ |
| suffix | Appends a value at the end of the formatted number. | String |  "&nbsp;" <br>_(empty string)_ |


### format.date&nbsp;_(&nbsp;value,&nbsp;options&nbsp;)_

#### **_value_** : Date | Number | String

Can be a Date object, a timestamp (number) or any valid date string (successfully parsed by _Date.parse()_ method).

#### **_options_** : Object

Should be an object having any of the properties below:

| Property | Description | Expected Type | Default Value |
|----------|--------------|:-------------:|:-------------:|
| pattern | The date format written with the specifiers below. | String | null |
| fields | An object containing callback functions for each custom fields of the _pattern_ property. | Object | {&nbsp;} <br>_(empty object)_ |
| prefix | Appends a value at the beggining of the formatted number. | String | "&nbsp;" <br>_(empty string)_ |
| suffix | Appends a value at the end of the formatted number. | String |  "&nbsp;" <br>_(empty string)_ |

The following specifiers can be used in the _pattern_ property:

| Specifier | Description | Example returned values |
|-----------|-------------|:-----------------------:|
| yyyy | A full numeric representation of a year, 4 digits | 1999 or 2019 |
| yy | A two digit representation of a year | 99 or 19 |
| m | Numeric representation of a month, without leading zeros | 1 to 12 |
| mm | Numeric representation of a month, with leading zeros | 01 to 12 |
| d | Day of the month | 1 to 31 |
| dd | Day of the month, 2 digits with leading zeros | 01 to 31 |
| h | 24-hour format of an hour without leading zeros | 1 to 23 |
| hh | 24-hour format of an hour with leading zeros | 01 to 23 |
| i | Minutes without leading zeros | 0 to 59 |
| ii | Minutes with leading zeros | 00 to 59 |
| s | Seconds without leading zeros | 0 to 59 |
| ss | Seconds with leading zeros | 00 to 59 |
| v | Milliseconds | 654 |
| z | Timezone offset | +03:00 |
| {&nbsp;_customField_&nbsp;} |  |  |

The specifiers in the _pattern_ can be escaped using a backslash "\\" character. Just remember to escape the backslash with another backslash first. Example:

```js
format.date('\\mont\\h: mm'); // results "month: 09" (for a date in September)
```

### format.text&nbsp;_(&nbsp;value,&nbsp;options&nbsp;)_

#### **_value_** : any

Can be a string or any other type,  in which case it'll be converted invoking the object's _toString()_ method.

#### **_options_** : Object

Should be an object having any of the properties below:

| Property | Description | Expected Type | Default Value |
|----------|--------------|:-------------:|:-------------:|
| trim | Strip blank characters from the beginning and end of the text. | Boolean | false |
| clearExtraSpaces | Same as _trim_, additionaly converting one or more consecutive blank characters into one space. | Boolean | false |
| upperCase | Make the text uppercase. | Boolean  | false |
| lowerCase | Make the text lowercase. | Boolean | false |
| capitalize | Uppercase the first letter of the text. | Boolean | false |
| capitalizeWords | Uppercase the first letter of each word in the text. | Boolean | false |
| truncateSize | Defines a maximum size for the text by eliminating the exceeding part and adding a suffix to it (defined in _truncateSuffix_&nbsp;), if necessary. | Number | null |
| truncateSuffix | Defines a suffix to be added to the end of the truncated text. | String | "&nbsp;..." |
| truncateWords | Defines if it's allowed to cut the last word of the truncated text in the middle, in order to reach the size specified in _truncateSize_, or if it should end only with entire words, taking the previous one if the last has been cut. | Boolean | false |
| prefix | Appends a value at the beggining of the formatted number. | String | "&nbsp;" <br>_(empty string)_ |
| suffix | Appends a value at the end of the formatted number. | String |  "&nbsp;" <br>_(empty string)_ |

### format.prototype (&nbsp;)

It will register a _format_ function for the objects of each respective Javascript type (_Number_, _Date_ and _String_), making it possible to write a cleaner and more readable code.

However, keep in mind that using non-native prototyped functions is not a recommended pratice, since the code can go into unexpected behavior in the future if the standards change. But it might not be an issue to mantain small projects though.
