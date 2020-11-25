import format from './format.mjs';



console.log(format.number(1000.5, {
    decimalDigits:      2,
    decimalSeparator:   ',',
    thousandsSeparator: '.'
  }
));


console.log(format.date(new Date('2020-09-05 16:15:00'), {
    pattern: '{abbrMonth} dd, yyyy - hh:ii',
    fields: {
      abbrMonth: date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    }
  }
));


let messedUpText = '   the QUICK browN fox jumps     OVER the lazy dog';
console.log(format.text(messedUpText, {
    clearExtraSpaces: true,
    toLowerCase:      true,
    capitalizeWords:  true,
    truncateSize:     35,
    truncateSuffix:   ' ...'
  }
));
