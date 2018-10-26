// http://kevhuang.com/subclasses-and-inheritance-in-javascript/

'use strict'

var moment = require('moment')
var FieldFormatter = require('./fieldFormatter')

function DateFormatter(fieldInfo) {
  FieldFormatter.call(this, fieldInfo)
}

DateFormatter.prototype = Object.create(FieldFormatter.prototype)
DateFormatter.prototype.constructor = DateFormatter

DateFormatter.prototype.valueConverter = function (value) {
  let date = moment(value)
  return '\'' + date.format('YYYY-MM-DD') + '\''
}

module.exports = DateFormatter
