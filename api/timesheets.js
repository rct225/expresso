const express = require('express');

const timesheetsRouter = express.Router({mergeParams: true});

module.exports = timesheetsRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  db.get('SELECT * FROM employee WHERE id=$id', { $id: timesheetId }, (error, timesheet) => {
    if (timesheet) {
      req.timesheet = timesheet;
      next();
    } else {
      res.status(404).send();
    }
  });
});

timesheetsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Timesheet WHERE employee_id = $employeeId',
    { $employeeId: req.employee.id},
    (error, timesheets) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({timesheets: timesheets});
      }
    });
});

timesheetsRouter.post('/', (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.employee.id;

  const timesheetSql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) ' +
                       'VALUES ($hours, $rate, $date, $employeeId)';
  const timesheetVals = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId
  };

  if (!hours || !rate || !date || !employeeId) {
    return res.status(400).send();
  }

  db.run(timesheetSql, timesheetVals, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
               (error, timesheet) => {
                 res.status(201).json({timesheet: timesheet});
               });
    }
  });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;
  const employeeId = req.employee.id;

  const timesheetSql = 'UPDATE Timesheet SET hours = $hours, rate = $rate, ' +
                       'date = $date, employee_id = $employeeId ' +
                       'WHERE id = $timesheetId';
  const timesheetVals = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId,
    $timesheetId: req.timesheet.id
  };

  if (!hours || !rate || !date || !employeeId) {
    return res.status(400).send();
  }

  db.run(timesheetSql, timesheetVals, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.timesheet.id}`,
               (error, timesheet) => {
                 res.status(200).json({timesheet: timesheet});
               });
    }
  });
});
