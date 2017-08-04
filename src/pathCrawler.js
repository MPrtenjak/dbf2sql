'use strict'

var path = require('path')
var fs = require('fs')
var sqlCreator = require('./sqlCreator/index.js')

function processDirSync(startPath, fileExt, encoding, createSQLFiles) {
  if (!fs.existsSync(startPath)) return

  var files = fs.readdirSync(startPath)
  for (var f = 0; f < files.length; f++) {
    var filename = path.join(startPath, files[f])

    var stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      processDirSync(filename, fileExt, encoding, createSQLFiles)
    } else if (filename.indexOf(fileExt) >= 0) {
      sqlCreator(filename, encoding, createSQLFiles)
    }
  }
}

module.exports = function (folder, fileExt, encoding, createSQLFiles) {
  processDirSync(folder, fileExt, encoding, createSQLFiles)
}

/*
function processDir(startPath, filter, cb) {
  if (!fs.existsSync(startPath)) return

  var files = fs.readdir(startPath, (err, files) => {
    if ((!err) && (files)) {
      for (var f = 0; f < files.length; f++) {
        var filename = path.join(startPath, files[f])

        var stat = fs.lstatSync(filename)
        if (stat.isDirectory()) {
          processDir(filename, filter, cb)
        }
        else if (filename.indexOf(filter) >= 0) {
          cb(filename)
        }
      }
    }
  })
}

function async() {
  var result = []
  processDir('C:/downlod/RPE', '.dbf', (filename) => { console.log(filename); result.push(filename) })
  console.log(result)
}

async()
*/