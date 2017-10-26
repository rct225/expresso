const express = require('express');

const menuItemsRouter = express.Router({mergeParams: true});

module.exports = menuItemsRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.get('/', (req, res, next) => {
  db.all('SELECT * from MenuItem where menu_id = $menuId',
    { $menuId: req.menu.id },
    (error, menuItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({menuItems: menuItems});
      }
    });
});
