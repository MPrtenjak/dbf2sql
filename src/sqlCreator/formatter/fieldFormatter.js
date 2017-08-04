'use strict'

function FieldFormatter(_fieldInfo) {
  this.fieldInfo = _fieldInfo

  this.sqlType = 'TEXT'
}

FieldFormatter.prototype.valueConverter = function (value) {
  return '\'' + value + '\''
}

FieldFormatter.prototype.createSQLField = function () {
  return this.fieldInfo.name + ' ' + this.sqlType
}

module.exports = FieldFormatter
