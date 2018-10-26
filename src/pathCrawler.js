'use strict'

var path = require('path')
var fs = require('fs')
var SqlCreator = require('./sqlCreator.js')

async function processDir(startPath, batchSize, fileExt, encoding, createSQLFiles) {
  if (!fs.existsSync(startPath)) return

  var files = fs.readdirSync(startPath)
  for (var f = 0; f < files.length; f++) {
    var filename = path.join(startPath, files[f])

    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      processDirSync(filename, fileExt, encoding, createSQLFiles)
    } else if (filename.indexOf(fileExt) >= 0) {
      try {
        await processFile(filename, fileExt, batchSize, encoding, createSQLFiles)
      }
      catch(e) {
        console.error(e)
      }
    }
  }
}

async function processFile(fileName, fileExt, batchSize, encoding, createSQLFiles) {
  let sqlCreator = new SqlCreator(createSQLFiles, fileExt, encoding)

  sqlCreator.echo(`Reading file: ${fileName}`, true);
  await sqlCreator.open(fileName);

  sqlCreator.writeSQLStatement(`PRAGMA synchronous=OFF`)

  let createFields = sqlCreator.tableFields.map(f => f.formatter.createSQLField()).join(',')
  sqlCreator.writeSQLStatement(`create table "${sqlCreator.tableName}" (${createFields})`)

  let fieldNames = sqlCreator.tableFields.map(f => f.name).join(',')
  let startOfInsertStmnt = `insert into "${sqlCreator.tableName}" (${fieldNames}) VALUES `

  let rowsRemaining = sqlCreator.dbf.recordCount;
  while (rowsRemaining > 0) {
    sqlCreator.echo(`.`);
    let rowsToRead = rowsRemaining > batchSize ? batchSize : rowsRemaining;
    let rows = await sqlCreator.dbf.readRecords(rowsToRead);

    rows.forEach(row => {
      if (encoding) sqlCreator.reinterpretRows(row)
      var values = sqlCreator.tableFields.map(f => f.formatter.valueConverter(row[f.name])).join(',')
      sqlCreator.writeSQLStatement(`${startOfInsertStmnt} (${values})`)
    });

    rowsRemaining -= rowsToRead;
  }

  sqlCreator.echo(``, true);
  sqlCreator.echo(``, true);
  sqlCreator.closeStream()
}

module.exports = processDir