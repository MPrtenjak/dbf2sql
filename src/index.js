'use strict'

var parseArgs = require('minimist')
var pathCrawler = require('./pathCrawler')

var argv = parseArgs(process.argv)

if (argv.h) {
  var help = `
    command line options:
      -f <folder>   source folder (all subfolders will be searched)
      -s            from every '.dbf' file program will create corresponding '.sql' file
      -c            encoding (all available encodings 
                             https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings) 
                    (if none is given, 'utf8' will be used)
      -e            DBase extension (if none is given, '.dbf' is used)
      -h            this help
  `
  console.log(help)
} else {
  var folder = argv.f || '.'
  var fileExt = argv.e || '.dbf'
  var encoding = argv.c || null
  var createSQLFiles = argv.s

  pathCrawler(folder, fileExt, encoding, createSQLFiles)
}
