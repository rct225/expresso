const express = require('express');

const menuItemsRouter = express.Router({mergeParams: true});

module.exports = menuItemsRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.get('/', (req, res, next) => {
  db.all('SELECT * from MenuItem where menu_id = $menuId',
    { $menuId: req.menu.id },
    (error, rows) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({menuItems: rows});
      }
    });
});

menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name;
  const description = req.body.menuItem.description;
  const inventory = req.body.menuItem.inventory;
  const price = req.body.menuItem.pice;
  const menuId = req.menu.id;

  if (!name || !description || !inventory || !price || !menuId) {
    res.status(400).send();
  } else {
    const menuItemsSql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) ' +
                         'VALUES ($name, $description, $inventory, $price, $menuId)';

    const menuItemsVals = {
      $name: name,
      $description: description,
      $inventory: inventory,
      $price: price,
      $menuId: menuId
    };

    db.run(menuItemsSql, menuItemsVals,
        function (error) {
          if (error) {
            next(error);
          } else {
            db.get(`SELECT * from MenuItem where MenuItem.id = ${this.lastID}`,
              (error, row) => {
                console.log(menuItem);
                res.status(201).json({menuItem: row});
              });
          }
        });
    }
});
