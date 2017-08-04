'use strict'

var FieldFormatter = require('./fieldFormatter')

function NumberFormatter(fieldInfo) {
  FieldFormatter.call(this, fieldInfo)
  this.sqlType = (fieldInfo.desc > 0) ? 'REAL' : 'INTEGER'
}

NumberFormatter.prototype = Object.create(FieldFormatter.prototype)
NumberFormatter.prototype.constructor = NumberFormatter

module.exports = NumberFormatter
