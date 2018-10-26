'use strict'

var fs = require('fs')
var path = require('path')
var iconv = require('iconv-lite')
var DBFFile = require('dbffile')

var Formatter = require('./formatter')

function SqlCreator(createSQLFiles, fileExt, encoding) {
  this.createSQLFiles = createSQLFiles
  this.fileExt = fileExt
  this.encoding = encoding

  this.tableName = null
  this.outputFileName = null
  this.outputStream = null
  this.dbf = null
  this.tableFields = null
}

SqlCreator.prototype.echo = function(text, newLine = null) {
  process.stdout.write(text);
  if (newLine) process.stdout.write(`\n`);
}

SqlCreator.prototype.open = async function(fileName) {
  this.dbf = await DBFFile.open(fileName);

  this.tableName = path.basename(this.dbf.path).replace(this.fileExt, '').replace(' ', '_')
  this.outputFileName = this.dbf.path.replace(this.fileExt, '.sql')

  if (this.createSQLFiles)
    this.outputStream = fs.createWriteStream(this.outputFileName)

  this.tableFields = this.dbf.fields.map(f => {
    return { name: f.name, formatter: Formatter(f) }
  })
}

SqlCreator.prototype.reinterpretRows = function(record) {
  for (let i = 0; i < this.dbf.fields.length; ++i) {
    let field = this.dbf.fields[i]
    if (field.type === 'C') {
      record[field.name] = iconv.decode(record._raw[field.name], this.encoding)
    }
  }
}

SqlCreator.prototype.writeSQLStatement = function(sqlCommand) {
  sqlCommand += ';\n';

  if (this.createSQLFiles) {
    this.outputStream.write(sqlCommand)
  } else {
    console.log(sqlCommand)
  }
}

SqlCreator.prototype.closeStream = function() {
  if (this.outputStream != null) {
    this.outputStream.end()
  }
}

module.exports = SqlCreator
