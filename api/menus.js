const express = require('express');

const menusRouter = express.Router();

module.exports = menusRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menusItemRouter = require('./menuItems');
employeesRouter.use('/:menuId/menuItems', menuItemsRouter);