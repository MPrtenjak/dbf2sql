'use strict'

var FieldFormatter = require('./fieldFormatter')

function StringFormatter(fieldInfo) {
  FieldFormatter.call(this, fieldInfo)
}

StringFormatter.prototype = Object.create(FieldFormatter.prototype)
StringFormatter.prototype.constructor = StringFormatter

StringFormatter.prototype.valueConverter = function (value) {
  // replace nonprintable chars (ascii < 0x20) 
  let outputValue = value.replace(/[\x00-\x19]+/g, '');

  // trim it
  outputValue = outputValue.trim();

  // replace single ' with ''
  outputValue = outputValue.replace('\'', '\'\'')

  return '\'' + outputValue + '\''
}

module.exports = StringFormatter
