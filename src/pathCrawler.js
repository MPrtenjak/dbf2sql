'use strict'

var path = require('path')
var fs = require('fs')
var SqlCreator = require('./sqlCreator.js')

function searchFiles(startPath, fileExt, dbfFiles) {
  if (!fs.existsSync(startPath)) return

  var files = fs.readdirSync(startPath)
  for (var f = 0; f < files.length; f++) {
    var filename = path.join(startPath, files[f])

    var stat = fs.lstatSync(filename)
    if (stat.isDirectory())
      searchFiles(filename, fileExt, dbfFiles)
    else if (filename.indexOf(fileExt) >= 0) {
      dbfFiles.push(filename)
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

async function work(startPath, fileExt, batchSize, encoding, createSQLFiles) {
  let dbfFiles = []

  searchFiles(startPath, fileExt, dbfFiles)
  for(let i = 0; i < dbfFiles.length; ++i)
    await processFile(dbfFiles[i], fileExt, batchSize, encoding, createSQLFiles)
}

module.exports = work