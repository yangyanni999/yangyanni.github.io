import _intl from 'intl';

var a = _intl.t('intl1');

var b = function (a) {
  var c = 0;
  return a;
};

b(a);
console.log(_intl.t('intl2'), _intl.t('intl3'));