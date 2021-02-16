var express = require("express");
var app = express();
var mysql = require("mysql");
var sql = require("mssql");
var config = require("./sqlconfig");
//const axios = require("axios");

module.exports = class SQLInterface {
  constructor() {}

  static test() {
    const con = mysql.createConnection(config);
    con.query("SHOW TABLES;", (err, rows) => {
      if (err) throw err;

      console.log("Data received from Db:");
      console.log(rows);
    });
    // console.log(config.port);
    // sql.connect(config, function (err) {
    //   if (err) console.log(err);
    //   console.log("Connected to shitty SQL database");
    //   var request = new sql.Request();

    //   request.query("show tables", function (err, recordset) {
    //     console.log("asdassfaaaaaaaaaaad");
    //     if (err) console.log(err);
    //     console.log(recordset);
    //   });
    //   // send records as a response
    //   //  res.send(recordset);
    // });
  }
};
