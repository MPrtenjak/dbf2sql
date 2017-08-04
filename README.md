# dbf2sql
Convert DBase files to SQLite create table/insert statements

# Purpose
I was given a bunch of ‘.dbf’ (Dbase III) files with data I needed. As I don’t have any old Dbase SW, I decided to transfer data to SQLite where I can join tables, clean data etc… 

# Usage
1.	Clone project
1.	Run `node src -f <folder>` and program will translate every `.dbf` file into `CREATE TABLE / INSERT` statements

## Options
* `-f <folder>` source folder (all subfolders will be searched)
* `-s` from every `.dbf` file program will create corresponding `.sql` file
* -c encoding (all available encodings https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings) (if none is given, ‘utf8’ will be used)
* `-e` DBase extension (if none is given, `.dbf` is used)


# Dependencies
*	` DBFFile` [https://github.com/paypac/DBFFile] _for reading Dbase files
*	` iconv-lite` [https://www.npmjs.com/package/iconv-lite] _for character encodings_
*	` minimist` [https://github.com/substack/minimist] _for working with commandline arguments_

# Examples 

```
// help
node src -h

// convert all .dbf files in c:\data folder 
//   to console
node src -f c:\data

// convert all .dbf files in c:\data folder 
//   to corresponding  .SQL files
node src -f c:\data -s

// convert all .dbf files in c:\data folder 
//   to corresponding  .SQL files
//   using windows-1250 code page
node src -f c:\data -s -c win1250
```

