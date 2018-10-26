'use strict'

let parseArgs = require('minimist')
let pathCrawler = require('./src/pathCrawler')

const start = async function() {
  var argv = parseArgs(process.argv)

  if (argv.h) {
    var help = `
      command line options:
        -f <folder>   source folder (all subfolders will be searched)
        -s            from every '.dbf' file program will create corresponding '.sql' file
        -c            encoding (all available encodings
                               https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings)
                      (if none is given, 'utf8' will be used)
        -b            batch size (num. of rows processed in one chunk), default 1000
        -e            DBase extension (if none is given, '.dbf' is used)
        -h            this help
    `
    console.log(help)
  } else {
    let folder = argv.f || '.'
    let fileExt = `.` + (argv.e || 'dbf')
    let encoding = argv.c || null
    let createSQLFiles = argv.s
    let batchSize = argv.b || 1000

    await pathCrawler(folder, batchSize, fileExt, encoding, createSQLFiles)
  }
}

start();
