# format

A simple and nifty Javascript object to format numbers, dates and text strings.

## Quick View

### Formatting Numbers

```js
console.log(format.number(1000.5, {
    thousandsSeparator: '.',
    decimalSeparator: ',',
    decimalDigits: 2
  }
));
// output: "1.000,50"
```

### Formatting Dates
```js
console.log(format.date(new Date('2020-09-05 16:15:00'), {
    pattern: '{abbrMonth} dd, yyyy - hh:ii',
    fields: {
      abbrMonth: date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    }
  }
));
// output: "Sep 05, 2020 - 16:15"
```

### Formatting Texts
```js
// messed up text
console.log(format.text('   the QUICK browN      fox jumps over the lazy dog', {
    clearExtraSpaces: true,
    toLowerCase:      true,
    capitalizeWords:  true,
    truncateSize:     35,
    truncateSuffix:   ' ...'
  }
));
// output: "The Quick Brown Fox Jumps Over ..." (length = 34)
```


# Library Reference

## format.number ( value, options )

### **_value_** : Number | String

Parameter _value_ can be a number or any valid numeric string.

### **_options_** : Object

Parameter _options_ should be an object having any of the properties below:

| Property | Expected Type | Default Value | How it Works |
|----------|:-------------:|:-------------:|--------------|
| integerDigits | Number | Null | Grants the integer part of the number has at least as many digits as specified here, by appending leading zeros to it, if it's necessary. |
| decimalDigits | Number | Null | Grants the decimal part of the number has exactly the quantity of digits specified here, by adding right zeros to it or by cropping the excess.<br>Notice that if the property _**round**_ is _true_, the number will firstly be rounded to the last decimal digit (specified here) before cropping. |
| decimalSeparator | String | "." <br>_(dot)_ | The character separating the integer part from the decimal one. |
| thousandsSeparator | String | "" <br>_(empty string)_ | The character delimiting each thousand multiple of the integer part (for instance, the commas in _1,000,000_&nbsp;). |
| decimalThousandsSeparator | String | "" <br>_(empty string)_ | The character delimiting each thousand multiple of the decimal part (for instance, the spaces in _0.000&nbsp;100&nbsp;250_&nbsp;, making it easier to read _100 micro_ and _250 nano_). |
| round | Boolean | false | Sets whether the number should be rounded or not. When rounding, the value set in _**decimalDigits**_ will be observed  (for instance, if _decimalDigits_ equals _2_, rounding the number _0.7899_ will result in _0.79_&nbsp;, not _1_ as someone could imagine). |
| prefix | String | "" <br>_(empty string)_ | Appends a value at the beggining of the formatted number. |
| suffix | String | "" <br>_(empty string)_ | Appends a value at the end of the formatted number. |


## format.date ( value, options )

### **_value_** : Date | Number | String

Parameter _value_ can be a Date object, a timestamp (number) or any valid date string (successfully parsed by Date.parse() method).

### **_options_** : Object

Parameter _options_ should be an object having any of the properties below:

_(the rest will be available soon)_

