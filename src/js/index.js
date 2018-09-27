import $ from 'jquery';
window.jQuery = $;
window.$ = $;

import enquire from 'enquire.js';
import 'slick-carousel';

$(document).ready(() => {
  let str = `window location is ${window.location}`;
  console.log(str);

  enquire.register('screen and (max-width:800px)', {
    match: function() {
      console.log('the screen is now small');
    },
    unmatch: function() {
      console.log('the screen is now large');
    },
  });

  $('.cont').slick();
});

require('expose-loader?vm!./vm');
vm.txt = 'ffuuuue';
