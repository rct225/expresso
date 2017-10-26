const express = require('express');

const timesheetsRouter = express.Router({mergeParams: true});

module.exports = timesheetsRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
