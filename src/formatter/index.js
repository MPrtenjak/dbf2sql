'use strict'

var DateFormatter = require('./dateFormatter')
var NumberFormatter = require('./numberFormatter')
var StringFormatter = require('./stringFormatter')

module.exports = function (fieldInfo) {
  if (fieldInfo.type === 'N') {
    return new NumberFormatter(fieldInfo)
  } else if (fieldInfo.type === 'D') {
    return new DateFormatter(fieldInfo)
  } else {
    return new StringFormatter(fieldInfo)
  }
}
