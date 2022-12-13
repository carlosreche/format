
import format from './format.js';


console.log(format.number(1000.5, {
    decimalDigits:      2,
    decimalSeparator:   ',',
    thousandsSeparator: '.'
  }
));
// output: "1.000,50"


console.log(format.date(new Date('2020-09-05 16:15:00'), {
    pattern: '{abbrMonth} dd, yyyy',
    fields: {
      abbrMonth: date => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
                          'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    }
  }
));
// output: "Sep 05, 2020"


let messedUpText = '   the QUICK browN fox jumps     OVER the lazy dog';
let fixedText = format.text(messedUpText, {
  trim:       true,
  lowerCase:  true,
  capitalize: true
});
console.log(fixedText);
// output: "The quick brown fox jumps over the lazy dog"


let cut = format.text(fixedText, {
    capitalizeWords: true,
    cutSize:         35,
    cutSuffix:       ' ...',
    cutWords:        false
});
console.log(cut);
console.log(`length = ${cut.length}`);
/* output:
    [String (CutText): 'The Quick Brown Fox Jumps Over ...'] {
      cutting: {
        isCut: true,
        kept: 'The Quick Brown Fox Jumps Over',
        cut: ' The Lazy Dog',
        suffix: ' ...'
      }
    }
    length = 34
*/
