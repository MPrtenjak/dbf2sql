'use strict'

var fs = require('fs')
var path = require('path')
var iconv = require('iconv-lite')
var DBFFile = require('dbffile')

var Formatter = require('./formatter')

module.exports = function (fileName, encoding, createSQLFiles) {
  var currentDBF = null
  var startOfInsertStmnt = null
  var tableFields = []

  var outputStream = null

  function reinterpretRows(dbf, record) {
    for (var i = 0; i < dbf.fields.length; ++i) {
      let field = dbf.fields[i]
      if (field.type === 'C') {
        record[field.name] = iconv.decode(record._raw[field.name], encoding)
      }
    }
  }

  function openStream(outputFileName) {
    if (createSQLFiles) {
      outputStream = fs.createWriteStream(outputFileName)
    }
  }

  function writeSQLStatement(sqlCommand) {
    sqlCommand += ';\n';

    if (createSQLFiles) {
      outputStream.write(sqlCommand)
    } else {
      console.log(sqlCommand)
    }
  }

  function closeStream() {
    if (outputStream != null) {
      outputStream.end()
    }
  }

  DBFFile.open(fileName)
    .then(dbf => {
      currentDBF = dbf

      tableFields = dbf.fields.map(f => {
        return { name: f.name, formatter: Formatter(f) }
      })

      openStream(dbf.path.replace('.dbf', '.sql'))
      writeSQLStatement(`PRAGMA synchronous=OFF`)

      var tableName = path.basename(dbf.path).replace('.dbf', '').replace(' ', '_')
      var createFields = tableFields.map(f => f.formatter.createSQLField()).join(',')
      writeSQLStatement(`create table "${tableName}" (${createFields})`)

      var fieldNames = tableFields.map(f => f.name).join(',')
      startOfInsertStmnt = `insert into "${tableName}" (${fieldNames}) VALUES `

      currentDBF = dbf
      return dbf.readRecords()
    })
    .then(rows => rows.forEach(row => {
      if (encoding) reinterpretRows(currentDBF, row)

      var values = tableFields.map(f => f.formatter.valueConverter(row[f.name])).join(',')

      writeSQLStatement(`${startOfInsertStmnt} (${values})`)
    }))
    .catch((err) => { console.log('An error occurred: ' + err) })
    .then(() => { closeStream() })
}
