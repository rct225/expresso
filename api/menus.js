const express = require('express');

const menusRouter = express.Router();

module.exports = menusRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menuItems');
menusRouter.use('/:menuId/menuItems', menuItemsRouter);

menusRouter.param('menuId', (req, res, next, menuId) => {
  db.get('SELECT * FROM Menu WHERE Menu.id=$id', { $id: menuId }, (error, menu) => {
    if (menu) {
      req.menu = menu;
      next();
    } else {
      res.status(404).send();
    }
  });
});

menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({menus: menus});
    }
  });
});

menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;

  if (!title) {
    return res.status(400).send();
  }

  db.run('INSERT into Menu (title) VALUES ($title)',
    { $title: title },
    function(error) {
      if (error) {
        next(error);
      } else {
        db.get(`SELECT * from Menu where Menu.id = ${this.lastID}`,
          (error, menu) => {
            if (error) {
              next(error);
            } else {
              res.status(201).json({ menu: menu });
            }
          });
      }
    });
});

menusRouter.get('/:menuId', (req, res, next) => {
  db.get('SELECT * from Menu where Menu.id = $menuId',
    {$menuId: req.menu.id },
    (error, menu) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({ menu: menu });
      }
    });
});
