import format from './format.mjs';

format.prototype();
const log = console.log;


log(format.number(1000.5, {
    thousandsSeparator: '.',
    decimalSeparator: ',',
    decimalDigits: 2
  }
));


log(format.date(new Date('2020-09-05 16:15:00'), {
    pattern: '{month} dd, yyyy - hh:ii',
    fields: {
      month: date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    }
  }
));

//--- formatting a messed up text
log(format.text('   the QUICK browN      fox jumps over the lazy dog', {
    clearExtraSpaces: true,
    toLowerCase:      true,
    capitalizeWords:  true,
    truncateSize:     35,
    truncateSuffix:   ' ...'
  }
)); // output: "The Quick Brown Fox Jumps Over ..." (length = 34)

