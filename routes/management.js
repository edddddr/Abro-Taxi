const express = require('express');
const router = express.Router();
const db = require('../config/db2.js');
const ethiopianDate = require('ethiopian-date');
const moments = require('moment');
const e = require('express');

// to display management form
router.get('/management', function (req, res) {
  const fullDate = new Date();

  const date = ethiopianDate.toEthiopian(
    fullDate.getFullYear(),
    fullDate.getMonth() + 1,
    fullDate.getDate() + 1
  );
  let staffData = {};

  const sql2 =
    'SELECT email,firstName,lastName,field FROM staff_table where field = ?';
  const sql3 = 'SELECT placeName FROM place_lists ORDER BY placeName  ASC';

  db.query(sql2, ['driver'], function (err2, data2) {
    if (err2) {
      console.error(err2);
      res.send('some error happened');
      return;
    } else if (data2 && data2.length) {
      staffData = data2;

      if (req.session.loggedInUser && req.session.field == 'management') {
        db.query(sql3, function (err3, data3) {
          if (err3) {
            console.error(err3);
            res.send('some error happened');
          } else if (data3 && data3.length) {
            res.render('management.ejs', {
              email: req.session.emailAddress,
              date: date,
              year: date[0],
              staff: staffData,
              places: data3,
            });
          } else {
            res.render('management.ejs', {
              email: req.session.emailAddress,
              date: date,
              year: date[0],
              staff: staffData,
              places: '',
            });
          }
        });
      } else {
        res.redirect('/login');
      }
    } else {
      const nodata = {};
      const nodataArray = [];

      nodata.email = 'no_email';
      nodata.firstName = 'No Driver registered';
      nodata.lastName = '';

      nodataArray.push(nodata);

      staffData = nodataArray;

      if (req.session.loggedInUser && req.session.field == 'management') {
        res.render('management.ejs', {
          email: req.session.emailAddress,
          date: date,
          year: date[0],
          staff: staffData,
        });
      } else {
        res.redirect('/login');
      }
    }
  });
});

router.get('/management2', function (req, res) {
  if (req.session.loggedInUser && req.session.field == 'management') {
    db.query(sql3, function (err3, data3) {
      if (err3) {
        console.error(err3);
        res.send('some error happened');
      } else if (data3 && data3.length) {
        res.render('management2.ejs', {
          email: req.session.emailAddress,
          date: 'date',
          year: 'date[0]',
          staff: [],
          places: data3,
        });
      } else {
        res.render('management2.ejs', {
          email: req.session.emailAddress,
          date: 'date',
          year: 'date[0]',
          staff: [],
          places: '',
        });
      }
    });
  } else {
    res.render('management2.ejs', {
      email: 'test@email',
      date: 'date',
      year: 'date[0]',
      staff: [],
      places: 'data3',
    });
  }
});

// to display users info
router.post('/allUsersInfo', function (req, res) {
  const msg = {};
  let sqlForStaffInfo;
  const start = req.body.start;
  const limit = req.body.limit;
  const serviceGroup = req.body.serviceGroup;

  if (serviceGroup == 'assigned') {
    sqlForStaffInfo =
      'select phone,firstName,middleName,lastName,serviceGroup,startPoint,endPoint,orderDate,userStates,paymentStates,orderDate,created from user_table where serviceGroup <> ? ORDER BY created DESC limit ?,?';
    db.query(
      sqlForStaffInfo,
      ['unassigned', parseInt(start), parseInt(limit)],
      function (err, data) {
        if (err) {
          msg.msg = 'Error while finding info ';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else if (data && data.length) {
          const lowTotal = [];
          for (let i = 0; i < data.length; i++) {
            const year1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');

            const year2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');

            const newArray = [];

            newArray.push(data[i].phone);
            newArray.push(
              data[i].name + ' ' + data[i].fname + ' ' + data[i].gname
            );
            newArray.push(data[i].serviceGroup);
            newArray.push(data[i].startPoint);
            newArray.push(data[i].endPoint);
            if (data[i].orderDate != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year2),
                  parseInt(month2),
                  parseInt(day2) + 1
                )
              );
            else newArray.push('');

            if (data[i].created != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year1),
                  parseInt(month1),
                  parseInt(day1) + 1
                )
              );
            else newArray.push('');

            newArray.push(data[i].userStates);
            newArray.push(data[i].paymetStates);

            lowTotal.push(newArray);
          }
          msg.states = 'success';
          msg.data = lowTotal;
          msg.serviceGroup = serviceGroup;
          res.json(msg);
        } else {
          msg.states = 'no data';
          res.json(msg);
        }
      }
    );
  } else if (serviceGroup == 'unassigned') {
    sqlForStaffInfo =
      'select phone,firstName,middleName,lastName,serviceGroup,startPoint,endPoint,orderDate,userStates,paymentStates,orderDate,created from user_table where serviceGroup = ? ORDER BY created DESC limit ?,?';
    db.query(
      sqlForStaffInfo,
      [serviceGroup, parseInt(start), parseInt(limit)],
      function (err, data) {
        if (err) {
          msg.msg = 'Error while finding info';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else if (data && data.length) {
          const lowTotal = [];
          for (let i = 0; i < data.length; i++) {
            const year1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');

            const year2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');

            const newArray = [];

            newArray.push(data[i].phone);
            newArray.push(
              data[i].name + ' ' + data[i].fname + ' ' + data[i].gname
            );
            newArray.push(data[i].serviceGroup);
            newArray.push(data[i].startPoint);
            newArray.push(data[i].endPoint);
            if (data[i].orderDate != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year2),
                  parseInt(month2),
                  parseInt(day2) + 1
                )
              );
            else newArray.push('');

            if (data[i].created != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year1),
                  parseInt(month1),
                  parseInt(day1) + 1
                )
              );
            else newArray.push('');

            newArray.push(data[i].userStates);
            newArray.push(data[i].paymentStates);

            lowTotal.push(newArray);
          }
          msg.states = 'success';
          msg.data = lowTotal;
          msg.serviceGroup = serviceGroup;
          res.json(msg);
        } else {
          msg.states = 'no data';
          res.json(msg);
        }
      }
    );
  }
});

// to allow service reorder for users
router.post('/allowReorder', function (req, res) {
  const phone = req.body.phone;
  const sqlForAllowingReorder =
    'UPDATE user-table SET reorder = ? WHERE phone =?';
  const msg = {};

  const sqlQueryForLeftSeats =
    'select leftVehicleSeat from driver-tasks where service-group = ?';
  const sqlQueryForUpdatingLeftSeats =
    'UPDATE driver-tasks SET leftVehicleSeat = ?  where service-group = ?';
  const sqlForFindingUser =
    'SELECT phone,service-group FROM user-table WHERE phone =? and service-group <> ?';
  const sqlForUpdatingServiceGroup =
    'UPDATE user-table SET service-group = ? WHERE phone =?';

  db.query(sqlForAllowingReorder, [phone, 'no'], function (err, result) {
    if (err) {
      msg.msg = 'Error while allowing user';
      msg.states = 'error';
      res.json(msg);
      console.error(err);
    } else if (result && result.length) {
      db.query(sqlForFindingUser, [phone, 'unassigned'], function (err, data1) {
        if (err) {
          msg.msg = 'Error while changing states';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else if (data1 && data1.length) {
          db.query(
            sqlQueryForLeftSeats,
            [data1[0].serviceGroup],
            function (err, data3) {
              if (err) {
                msg.states = 'error';
                msg.msg = 'some error happened while loading left seats';
                console.error(err);
                res.json(msg);
              } else if (data3 && data3.length) {
                if (data3[0].leftVehicleSeat > 0) {
                  const leftSeats = parseInt(data3[0].leftVehicleSeat);
                  const currentLeftSeats = leftSeats - 1;

                  db.query(
                    sqlQueryForUpdatingLeftSeats,
                    [currentLeftSeats, data1[0].serviceGroup],
                    function (err, result2) {
                      if (err) {
                        msg.msg = 'Error while managing left seats';
                        msg.states = 'error';
                        res.json(msg);
                        console.error(err);
                      } else {
                        if (result2.changedRows > 0) {
                          msg.states = 'success';
                          res.json(msg);
                        } else {
                          msg.msg = 'Error while managing left seats';
                          msg.states = 'error';
                          res.json(msg);
                        }
                      }
                    }
                  );
                }
              } else {
                msg.states = 'error';
                msg.msg = 'cannot load left seats';
                res.json(msg);
              }
            }
          );
        } else {
          msg.states = 'success';
          res.json(msg);
        }
      });
    } else {
      msg.msg = 'Error while allowing user';
      msg.states = 'error';
      res.json(msg);
    }
  });
});

// to add users to service
router.post('/addUserToServiceGroup', function (req, res) {
  const serviceGroup = req.body.serviceGroup;
  const phone = req.body.phone;
  const msg = {};

  let leftSeats;

  const sqlQueryForLeftSeats =
    'SELECT leftVehicleSeat FROM driver_tasks WHERE serviceGroup = ?';
  const sqlQueryForUpdatingLeftSeats =
    'UPDATE driver_tasks SET leftVehicleSeat = ?  WHERE serviceGroup = ?';
  const sqlForFindingUser =
    'SELECT phone FROM user_table WHERE phone =? AND serviceGroup = ?';
  const sqlForUpdatingServiceGroup =
    'UPDATE user_table SET serviceGroup = ? WHERE phone =?';

  db.query(sqlQueryForLeftSeats, [serviceGroup], function (err, data) {
    if (err) {
      msg.states = 'error';
      msg.msg = 'some error happened while loading left seats';
      console.error(err);
      res.json(msg);
      return;
    }
    if (data && data.length) {
      if (data[0].leftVehicleSeat > 0) {
        leftSeats = data[0].leftVehicleSeat;
        db.query(
          sqlForFindingUser,
          [phone, serviceGroup],
          function (err, data) {
            if (err) {
              msg.msg = 'Error while changing states';
              msg.states = 'error';
              res.json(msg);
              console.error(err);
            } else {
              if (data && data.length) {
                msg.msg = 'user already assigned to ' + serviceGroup;
                msg.states = 'warning';
                res.json(msg);
              } else {
                db.query(
                  sqlForUpdatingServiceGroup,
                  [serviceGroup, phone],
                  function (err, result) {
                    if (err) {
                      msg.msg = 'Error while adding user to ' + serviceGroup;
                      msg.states = 'error';
                      res.json(msg);
                      console.error(err);
                      return;
                    }
                    if (result.changedRows > 0) {
                      const currentLeftSeats = leftSeats - 1;

                      db.query(
                        sqlQueryForUpdatingLeftSeats,
                        [currentLeftSeats, serviceGroup],
                        function (err, result2) {
                          if (err) {
                            msg.msg =
                              'Error while adding user to ' + serviceGroup;
                            msg.states = 'error';
                            res.json(msg);
                            console.error(err);
                            return;
                          }
                          if (result2.changedRows > 0) {
                            msg.states = 'success';
                            msg.phone = phone;
                            msg.msg =
                              'user successfully added to ' + serviceGroup;
                            res.json(msg);
                            return;
                          }
                          msg.msg =
                            'Error while adding user to ' + serviceGroup;
                          msg.states = 'error';
                          res.json(msg);
                        }
                      );
                      return;
                    }
                    msg.msg = 'Error while adding user to ' + serviceGroup;
                    msg.states = 'error';
                    res.json(msg);
                  }
                );
              }
            }
          }
        );
        return;
      }
      msg.states = 'warning';
      msg.msg = 'no available left seats';
      res.json(msg);
      return;
    }
    msg.states = 'error';
    msg.msg = 'cannot load left seats';
    res.json(msg);
  });
});

// Move user to service
router.post('/moveUserToServiceGroup', function (req, res) {
  const serviceGroup = req.body.serviceGroup;
  const phone = req.body.phone;
  const msg = {};

  const sqlQueryForLeftSeats =
    'select leftVehicleSeat from driver_tasks where serviceGroup = ?';
  const sqlQueryForUpdatingLeftSeats =
    'UPDATE driver_tasks SET leftVehicleSeat = ?  where serviceGroup = ?';
  const sqlForFindingUser =
    'SELECT phone,serviceGroup FROM user_table WHERE phone =? and serviceGroup <> ? and serviceGroup <> ?';
  const sqlForUpdatingServiceGroup =
    'UPDATE user_table SET serviceGroup = ? WHERE phone =?';

  db.query(
    sqlForFindingUser,
    [phone, 'unassigned', serviceGroup],
    function (err, data1) {
      if (err) {
        msg.msg = 'Error while changing states';
        msg.states = 'error';
        console.error(err);
        res.json(msg);
        return;
      }
      if (data1 && data1.length) {
        db.query(
          sqlQueryForLeftSeats,
          [data1[0].serviceGroup],
          function (err, data2) {
            if (err) {
              msg.states = 'error';
              msg.msg = 'some error happened while loading left seats';
              console.error(err);
              res.json(msg);
            } else if (data2 && data2.length) {
              const leftSeats = parseInt(data2[0].leftVehicleSeat);
              const currentLeftSeats = leftSeats + 1;

              db.query(
                sqlQueryForUpdatingLeftSeats,
                [currentLeftSeats, data1[0].serviceGroup],
                function (err, result2) {
                  if (err) {
                    msg.msg = 'Error while adding user to ' + serviceGroup;
                    msg.states = 'error';
                    res.json(msg);
                    console.error(err);
                  } else {
                    if (result2.changedRows > 0) {
                      db.query(
                        sqlForUpdatingServiceGroup,
                        [serviceGroup, phone],
                        function (err, result) {
                          if (err) {
                            msg.msg =
                              'Error while adding user to ' + serviceGroup;
                            msg.states = 'error';
                            res.json(msg);
                            console.error(err);
                          } else if (result.changedRows > 0) {
                            db.query(
                              sqlQueryForLeftSeats,
                              [serviceGroup],
                              function (err, data3) {
                                if (err) {
                                  msg.states = 'error';
                                  msg.msg =
                                    'some error happened while loading left seats';
                                  console.error(err);
                                  res.json(msg);
                                } else if (data3 && data3.length) {
                                  if (data3[0].leftVehicleSeat > 0) {
                                    const leftSeats = parseInt(
                                      data3[0].leftVehicleSeat
                                    );
                                    const currentLeftSeats = leftSeats - 1;

                                    db.query(
                                      sqlQueryForUpdatingLeftSeats,
                                      [currentLeftSeats, serviceGroup],
                                      function (err, result2) {
                                        if (err) {
                                          msg.msg =
                                            'Error while adding user to ' +
                                            serviceGroup;
                                          msg.states = 'error';
                                          res.json(msg);
                                          console.error(err);
                                        } else {
                                          if (result2.changedRows > 0) {
                                            msg.states = 'success';
                                            msg.phone = phone;
                                            msg.msg =
                                              'user successfully moved to ' +
                                              serviceGroup;
                                            res.json(msg);
                                            return;
                                          } else {
                                            msg.msg =
                                              'Error while adding user to ' +
                                              serviceGroup;
                                            msg.states = 'error';
                                            res.json(msg);
                                          }
                                        }
                                      }
                                    );
                                  }
                                } else {
                                  msg.states = 'error';
                                  msg.msg = 'cannot load left seats';
                                  res.json(msg);
                                }
                              }
                            );
                          } else {
                            msg.msg = 'No change made!';
                            msg.states = 'warning';
                            res.json(msg);
                          }
                        }
                      );
                    } else {
                      msg.msg = 'Error while adding user to ' + serviceGroup;
                      msg.states = 'error';
                      res.json(msg);
                    }
                  }
                }
              );
            } else {
              msg.states = 'error';
              msg.msg = 'cannot load left seats';
              res.json(msg);
            }
          }
        );
        return;
      }
      msg.msg = 'user not moved to any group';
      msg.states = 'warning';
      res.json(msg);
    }
  );
});

// to find and load left seats
router.post('/loadLeftSeats', function (req, res) {
  const serviceGroup = req.body.serviceGroup;
  const msg = {};

  const sqlQuery =
    'select leftVehicleSeat from driver-tasks where service-group = ?';

  db.query(sqlQuery, [serviceGroup], function (err, data) {
    if (err) {
      msg.states = 'error';
      msg.msg = 'some error happened while loading left seats';
      console.error(err);
      res.json(msg);
    } else if (data && data.length) {
      msg.states = 'success';
      msg.data = data;

      res.json(msg);
    } else {
      msg.states = 'error';
      msg.msg = 'cannot load left seats';
      res.json(msg);
    }
  });
});

// to display service groups
router.post('/serviceGroups', function (req, res) {
  const sqlQuery =
    'select id,start-point,end-point,service-group,leftVehicleSeat from driver-tasks where start-point = ? and end-point = ?  ORDER BY created-at DESC';

  const msg = {};

  db.query(
    sqlQuery,
    [req.body.startPoint, req.body.endPoint],
    function (err, data) {
      if (err) {
        msg.states = 'error';
        msg.msg = 'error while loading';
        console.error(err);

        res.json(msg);

        return;
      } else if (data && data.length) {
        msg.states = 'success';
        msg.data = data;

        res.json(msg);
      } else {
        msg.states = 'error';
        msg.msg = 'no service group with this routes';

        res.json(msg);
      }
    }
  );
});

// to display users
router.post('/loadUsers', function (req, res) {
  const sqlQuery = '';

  const msg = {};

  if (req.body.type == 'assigned') {
    sqlQuery =
      'select phone,firstName,middle-name from user-table where start-point = ? and end-point = ? and service-group <> ? ORDER BY created DESC';

    db.query(
      sqlQuery,
      [req.body.startPoint, req.body.endPoint, 'unassigned'],
      function (err, data) {
        if (err) {
          msg.states = 'error';
          msg.msg = 'error while loading';
          console.error(err);
          res.json(msg);

          return;
        } else if (data && data.length) {
          msg.states = 'success';
          msg.data = data;
          res.json(msg);
        } else {
          msg.states = 'error';
          msg.msg = 'no user registered with the selected parameters';
          res.json(msg);
        }
      }
    );
  } else if (req.body.type == 'unassigned') {
    sqlQuery =
      'select phone,firstName,middle-name from user-table where start-point = ? and end-point = ? and service-group = ?  ORDER BY created DESC';

    db.query(
      sqlQuery,
      [req.body.startPoint, req.body.endPoint, 'unassigned'],
      function (err, data) {
        if (err) {
          msg.states = 'error';
          msg.msg = 'error while loading';
          console.error(err);

          res.json(msg);

          return;
        } else if (data && data.length) {
          msg.states = 'success';
          msg.data = data;
          res.json(msg);
        } else {
          msg.states = 'error';
          msg.msg = 'no user registered with the selected parameters';
          res.json(msg);
        }
      }
    );
  }
});

// to display task assigning window
router.get('/taskAssigning', function (req, res) {
  if (req.session.loggedInUser && req.session.field == 'management') {
    const emailAddress = req.session.emailAddress;
    req.session.loggedInUser = true;
    req.session.emailAddress = emailAddress;
    req.session.field = 'management';
    res.redirect('/taskAssigningInner');
  } else {
    res.redirect('/login');
  }
});

// to display assigned tasks
router.post('/assignedTasks', function (req, res) {
  const msg = {};
  let sqlForStaffInfo;
  const fullDate = new Date();
  const etDate = ethiopianDate.toEthiopian(
    fullDate.getFullYear(),
    fullDate.getMonth() + 1,
    fullDate.getDate() + 1
  );

  sqlForStaffInfo = 'SELECT * FROM driver-tasks  ORDER BY createdAt DESC';
  db.query(sqlForStaffInfo, function (err, data) {
    if (err) {
      msg.msg = 'Error while finding info ';
      msg.states = 'error';
      res.json(msg);
      console.error(err);
    } else {
      if (data && data.length) {
        const lowTotal = [];
        for (let i = 0; i < data.length; i++) {
          const newArray = [];
          newArray.push(data[i].id);
          newArray.push(data[i].email);
          newArray.push(data[i].name);
          newArray.push(data[i].startPoint);
          newArray.push(data[i].endPoint);
          newArray.push(data[i].monthlyPayment);
          newArray.push(data[i].taskType);
          newArray.push(data[i].availableVehicleSeat);
          newArray.push(data[i].leftVehicleSeat);
          newArray.push(data[i].serviceGroup);
          newArray.push(data[i].plateNumber);
          newArray.push(data[i].assignedBy);

          lowTotal.push(newArray);
        }
        msg.states = 'success';
        msg.data = lowTotal;
        res.json(msg);
      } else {
        msg.msg = 'No task available';
        msg.states = 'warning';
        res.json(msg);
      }
    }
  });
});

// to display users info
router.post('/usersInfo', function (req, res) {
  const msg = {};
  let sqlForStaffInfo;

  if (req.body.phone == 'All') {
    if (req.body.serviceType == 'assigned') {
      sqlForStaffInfo =
        'select phone,name,firstName,middle-name,service-group,start-point,end-point,order-date,user-states,payment-states,order-date,created from user-table where start-point = ? and end-point = ? and  service-group <> ? ORDER BY created DESC';
    } else {
      sqlForStaffInfo =
        'select phone,firstName,middle-name,lastName,service-group,start-point,end-point,order-date,user-states,payment-states,order-date,created from user-table where start-point = ? and end-point = ? and  service-group = ? ORDER BY created DESC';
    }

    db.query(
      sqlForStaffInfo,
      [req.body.startPoint, req.body.endPoint, 'unassigned'],
      function (err, data) {
        if (err) {
          msg.msg = 'Error while finding info ';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else {
          if (data && data.length) {
            const lowTotal = [];
            for (let i = 0; i < data.length; i++) {
              const year1 = moments(
                data[i].created,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('YYYY');
              const month1 = moments(
                data[i].created,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('M');
              const day1 = moments(
                data[i].created,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('D');

              const year2 = moments(
                data[i].orderDate,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('YYYY');
              const month2 = moments(
                data[i].orderDate,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('M');
              const day2 = moments(
                data[i].orderDate,
                'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
              ).format('D');

              const newArray = [];

              newArray.push(data[i].phone);
              newArray.push(
                data[i].name + ' ' + data[i].fname + ' ' + data[i].gname
              );
              newArray.push(data[i].serviceGroup);
              newArray.push(data[i].startPoint);
              newArray.push(data[i].endPoint);
              if (data[i].orderDate != null)
                newArray.push(
                  ethiopianDate.toEthiopian(
                    parseInt(year2),
                    parseInt(month2),
                    parseInt(day2) + 1
                  )
                );
              else newArray.push('');

              if (data[i].created != null)
                newArray.push(
                  ethiopianDate.toEthiopian(
                    parseInt(year1),
                    parseInt(month1),
                    parseInt(day1) + 1
                  )
                );
              else newArray.push('');

              newArray.push(data[i].userStates);
              newArray.push(data[i].paymetStates);
              lowTotal.push(newArray);
            }
          }

          res.json(lowTotal);
        }
      }
    );
  } else {
    sqlForStaffInfo =
      'select phone,firstName,middle-name,lastName,start-point,end-point,order-date,user-states,payment-states,service-group,order-date,created from user-table where phone = ? ORDER BY created DESC';
    db.query(sqlForStaffInfo, [req.body.phone], function (err, data) {
      if (err) {
        msg.msg = 'Error while finding info ';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
      } else {
        if (data && data.length) {
          const lowTotal = [];
          for (let i = 0; i < data.length; i++) {
            const year1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day1 = moments(
              data[i].created,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');

            const year2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('YYYY');
            const month2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('M');
            const day2 = moments(
              data[i].orderDate,
              'ddd MMM DD YYYY hh:mm:ss [GMT]ZZ'
            ).format('D');
            const newArray = [];

            newArray.push(data[i].phone);
            newArray.push(
              data[i].name + ' ' + data[i].fname + ' ' + data[i].gname
            );
            newArray.push(data[i].serviceGroup);
            newArray.push(data[i].startPoint);
            newArray.push(data[i].endPoint);
            if (data[i].orderDate != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year2),
                  parseInt(month2),
                  parseInt(day2) + 1
                )
              );
            else newArray.push('');

            if (data[i].created != null)
              newArray.push(
                ethiopianDate.toEthiopian(
                  parseInt(year1),
                  parseInt(month1),
                  parseInt(day1) + 1
                )
              );
            else newArray.push('');
            newArray.push(data[i].userStates);

            newArray.push(data[i].paymetStates);

            lowTotal.push(newArray);
          }
        }

        res.json(lowTotal);
      }
    });
  }
});

// to display drivers info
router.post('/driverInfos', function (req, res) {
  const msg = {};
  let sqlForStaffInfo;
  if (req.body.email == 'All') {
    sqlForStaffInfo =
      'SELECT firstName,lastName,phone,email,serviceType,typeOfCar,modelOfCar,capacityOfCar,gender,plateNumber,createdAt,states FROM staff_table where field = ?';
    db.query(sqlForStaffInfo, ['driver'], function (err, data) {
      if (err) {
        msg.msg = 'Error while finding info ';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
      } else {
        if (data && data.length) {
          const lowTotal = [];
          for (let i = 0; i < data.length; i++) {
            const newArray = [];

            const date = new Date(data[i].createdAt);
            const dates =
              date.getFullYear() + ',' + date.getMonth() + ',' + date.getDay();

            newArray.push(data[i].email);
            newArray.push(data[i].firstName + ' ' + data[i].lastName);
            newArray.push(data[i].phone);
            newArray.push(data[i].serviceType);
            newArray.push(data[i].typeOfCar);
            newArray.push(data[i].modelOfCar);
            newArray.push(data[i].availableVehicleSeat);
            newArray.push(data[i].plateNumber);
            newArray.push(dates);
            newArray.push(data[i].states);

            lowTotal.push(newArray);
          }
        }

        msg.states = 'success';
        msg.data = lowTotal;
        res.json(msg);
      }
    });
  } else {
    sqlForStaffInfo =
      'SELECT firstName,lastName,phone,email,serviceType,typeOfCar,modelOfCar,plateNumber,createdAt,states,availableVehicleSeat FROM staff_table WHERE field = ? and email =?';

    db.query(sqlForStaffInfo, ['driver', req.body.email], function (err, data) {
      if (err) {
        msg.msg = 'Error while finding info ';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
      } else if (data && data.length) {
        const lowTotal = [];
        for (let i = 0; i < data.length; i++) {
          const newArray = [];

          const date = new Date(data[i].createdAt);
          const dates =
            date.getFullYear() + ',' + date.getMonth() + ',' + date.getDay();

          newArray.push(data[i].email);
          newArray.push(data[i].firstName + ' ' + data[i].lastName);
          newArray.push(data[i].phone);
          newArray.push(data[i].serviceType);
          newArray.push(data[i].typeOfCar);
          newArray.push(data[i].modelOfCar);
          newArray.push(data[i].availableVehicleSeat);
          newArray.push(data[i].plateNumber);
          newArray.push(dates);
          newArray.push(data[i].states);

          lowTotal.push(newArray);
        }

        msg.states = 'success';
        msg.data = lowTotal;
        res.json(msg);
      } else {
        msg.msg = 'No driver data found';
        msg.states = 'error';
        res.json(msg);
      }
    });
  }
});

// to enable driver to get access
router.post('/enableDriver', function (req, res) {
  const msg = {};
  const sqlForFindingStaff = 'SELECT email FROM staff_table WHERE email =?';
  const sqlForUpdatingStaffStates =
    'UPDATE staff_table SET states = ? WHERE email =?';
  const sqlForUpdatingStaffStates2 =
    'UPDATE staff_table SET states = ? where field = ?';

  if (req.body.email == 'All') {
    db.query(
      sqlForUpdatingStaffStates2,
      [req.body.states, 'driver'],
      function (err) {
        if (err) {
          msg.msg = 'Error while changing states';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else {
          msg.msg = 'successful';
          msg.states = 'success';
          res.json(msg);
        }
      }
    );
  } else {
    db.query(sqlForFindingStaff, [req.body.email], function (err, data) {
      if (err) {
        msg.msg = 'Error while changing states';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
      } else {
        if (data && data.length) {
          db.query(
            sqlForUpdatingStaffStates,
            [req.body.states, req.body.email],
            function (err) {
              if (err) {
                msg.msg = 'Error while changing states';
                msg.states = 'error';
                res.json(msg);
                console.error(err);
              } else {
                msg.msg = 'successful';
                msg.states = 'success';
                res.json(msg);
              }
            }
          );
        } else {
          msg.msg = 'no driver data found';
          msg.states = 'error';
          res.json(msg);
        }
      }
    });
  }
});

router.get('/getAddServiceSetting', function (req, res) {
  const getDriverQuery = 'SELECT * FROM driver_table WHERE phone = ? LIMIT 1';
  const getPlacesQuery = 'SELECT placeName FROM place_lists WHERE 1';

  const msg = {};

  db.query(
    getDriverQuery,
    ['+251' + req.query.phone.slice(-9)],
    function (err, dbResult) {
      if (err) {
        msg.msg = 'Error while finding driver';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
        return;
      }

      if (dbResult && dbResult.length) {
        let placeLists;

        db.query(getPlacesQuery, [], function (errPlaceList, placeListsResult) {
          if (errPlaceList) {
            console.error(errPlaceList);
            return;
          }
          if (placeListsResult && placeListsResult.length) {
            placeLists = placeListsResult;

            msg.states = 'success';
            msg.driverInfo = `Name: ${dbResult[0].firstName} ${dbResult[0].middleName}, Phone: ${dbResult[0].phone}, Type of vehicle: ${dbResult[0].typeOfCar}, Capacity: ${dbResult[0].capacityOfCar}, Plate No: ${dbResult[0].plateNumber}`;
            msg.data = {
              firstName: dbResult[0].firstName,
              middleName: dbResult[0].middleName,
              phone: dbResult[0].phone,
              email: dbResult[0].email,
              states: dbResult[0].states,
              userType: dbResult[0].userType,
              capacity: dbResult[0].capacityOfCar,
              plateNumber: dbResult[0].plateNumber,
              VehicleModel: dbResult[0].modelOfCar,
              vehicleName: dbResult[0].typeOfCar,
              serviceType: dbResult[0].serviceType,
            };
            if (placeLists) msg.placeLists = placeLists;
            res.json(msg);
          }
        });
      }
    }
  );
});

router.post('/getUserSettingDetail', function (req, res) {
  const getUserQuery = 'SELECT * FROM user_table WHERE phone = ? LIMIT 1';
  const getPlacesQuery = 'SELECT placeName FROM place_lists WHERE 1';
  const getServiceGroupQuery =
    'SELECT serviceGroup FROM driver_tasks WHERE startPoint=? AND endPoint=? AND leftVehicleSeat>0';

  const msg = {};

  db.query(
    getUserQuery,
    ['+251' + req.body.phone.slice(-9)],
    function (err, dbResult) {
      if (err) {
        msg.msg = 'Error while finding driver';
        msg.states = 'error';
        res.json(msg);
        console.error(err);
        return;
      }

      if (dbResult && dbResult.length) {
        let placeLists;
        let serviceLists;

        if (Number(req.body.places)) {
          db.query(
            getPlacesQuery,
            [],
            function (errPlaceList, placeListsResult) {
              if (errPlaceList) {
                console.error(errPlaceList);
                return;
              }
              if (placeListsResult && placeListsResult.length) {
                placeLists = placeListsResult;
              }
              processResponse();
            }
          );
          return;
        }

        function processResponse() {
          db.query(
            getServiceGroupQuery,
            [dbResult[0].startPoint, dbResult[0].endPoint],
            function (getServiceErr, getServiceResult) {
              if (getServiceErr) {
                console.error(getServiceErr);
              }
              if (getServiceResult && getServiceResult.length) {
                serviceLists = getServiceResult;
              }
              msg.states = 'success';
              msg.userInfo = `Name: ${dbResult[0].firstName} ${dbResult[0].middleName}, Phone: ${dbResult[0].phone}, Departure: ${dbResult[0].startPoint}, Drop off: ${dbResult[0].endPoint}, Service Group: ${dbResult[0].serviceGroup}, Payment States: ${dbResult[0].paymentStates}, Reorder requested: ${dbResult[0].reorder}`;
              msg.data = {
                firstName: dbResult[0].firstName,
                middleName: dbResult[0].middleName,
                phone: dbResult[0].phone,
                email: dbResult[0].email,
                userStates: dbResult[0].userStates,
                departure: dbResult[0].startPoint,
                dropOff: dbResult[0].endPoint,
                orderDate: dbResult[0].orderDate,
                created: dbResult[0].created,
                userType: dbResult[0].userType,
                gender: dbResult[0].gender,
                paymentStates: dbResult[0].paymentStates,
                serviceGroup: dbResult[0].serviceGroup,
                reorder: dbResult[0].reorder,
                organizationName: dbResult[0].organizationName,
                userId: dbResult[0].userId,
              };
              if (placeLists) {
                msg.placeLists = placeLists;
              }
              if (serviceLists) {
                msg.serviceLists = serviceLists;
              }
              res.json(msg);
            }
          );
        }

        processResponse();
        return;
      }
      msg.states = 'warning';
      msg.msg = 'no user registered!';
      res.json(msg);
    }
  );
});

router.get('/serviceGroupDetail', (req, res) => {
  const msg = {};
  const getServiceGroupQuery =
    'SELECT * FROM driver_tasks WHERE serviceGroup=?';

  db.query(
    getServiceGroupQuery,
    [req.query.serviceGroup],
    function (errFindService, resultService) {
      if (errFindService) {
        console.error(errFindService);
        msg.states = 'error';
        res.json(msg);
        return;
      }

      if (resultService && resultService.length) {
        msg.states = 'success';
        msg.data = {
          serviceGroup: resultService[0].serviceGroup,
          leftSeats: resultService[0].leftVehicleSeat,
          serviceStates: resultService[0].states,
          plateNumber: resultService[0].plateNumber,
          detail: resultService[0],
        };
        res.json(msg);
        return;
      }
      msg.states = 'warning';
      msg.msg = 'this service is removed or unavailable!';
      res.json(msg);
    }
  );
});

router.post('/serviceGroupDetail', (req, res) => {
  const msg = {};
  const getServiceGroupQuery =
    'SELECT * FROM driver_tasks WHERE serviceGroup=?';
  const getPlacesQuery = 'SELECT placeName FROM place_lists WHERE 1';

  db.query(
    getServiceGroupQuery,
    [req.body.serviceGroup],
    function (errFindService, resultService) {
      if (errFindService) {
        console.error(errFindService);
        msg.states = 'error';
        res.json(msg);
        return;
      }

      if (resultService && resultService.length) {
        let placeLists;
        msg.states = 'success';
        msg.data = {
          serviceGroup: resultService[0].serviceGroup,
          leftSeats: resultService[0].leftVehicleSeat,
          serviceStates: resultService[0].states,
          plateNumber: resultService[0].plateNumber,
          detail: resultService[0],
        };
        if (Number(req.body.places)) {
          db.query(
            getPlacesQuery,
            [],
            function (errPlaceList, placeListsResult) {
              if (errPlaceList) {
                console.error(errPlaceList);
                return;
              }
              if (placeListsResult && placeListsResult.length) {
                placeLists = placeListsResult;
              }

              if (placeLists) msg.placeLists = placeLists;
              res.json(msg);
            }
          );
          return;
        }
        res.json(msg);
        return;
      }
      msg.states = 'warning';
      msg.msg = 'this service is removed or unavailable!';
      res.json(msg);
    }
  );
});

router.get('/driverSearch', function (req, res) {
  db.query(
    'SELECT * FROM driver_table WHERE field =? AND phone LIKE "%' +
      req.query.phone +
      '%" OR phone LIKE "%' +
      '251' +
      req.query.phone.slice(1) +
      '%"  limit 10',
    ['driver'],
    function (err, rows) {
      if (err) throw err;
      const dataList = [];
      if (rows && rows.length) {
        for (i = 0; i < rows.length; i++) {
          let orgData = {};
          orgData.phone = rows[i].phone;
          orgData.info =
            rows[i].firstName +
            ', plate no: ' +
            rows[i].plateNumber +
            ', capacity: ' +
            rows[i].availableVehicleSeat;
          dataList.push(orgData);
        }
        res.json(dataList);
        return;
      }
      res.json([{ phone: 'no driver found', info: '' }]);
    }
  );
});

router.get('/serviceGroupSearch', function (req, res) {
  db.query(
    'SELECT * FROM driver_tasks WHERE serviceGroup LIKE "%' +
      req.query.searchValue +
      '%" OR plateNumber LIKE "%' +
      req.query.searchValue +
      '%"  limit 10',
    function (err, rows) {
      if (err) throw err;

      if (rows && rows.length) {
        res.json(rows.map((row) => row.serviceGroup));
        return;
      }
      res.json(['no service group found']);
    }
  );
});

router.get('/manageServiceGroupSearch', function (req, res) {
  db.query(
    'SELECT * FROM driver_tasks WHERE serviceGroup LIKE "%' +
      req.query.searchValue +
      '%" OR plateNumber LIKE "%' +
      req.query.searchValue +
      '%"  limit 10',
    function (err, rows) {
      if (err) throw err;
      const dataList = [];
      if (rows && rows.length) {
        for (i = 0; i < rows.length; i++) {
          let orgData = {};
          orgData.serviceGroup = rows[i].serviceGroup;
          orgData.info =
            ' plate no: ' +
            rows[i].plateNumber +
            ', left: ' +
            rows[i].leftVehicleSeat;
          dataList.push(orgData);
        }
        res.json(dataList);
        return;
      }
      res.json([{ serviceGroup: 'no service found', info: '' }]);
    }
  );
});

router.get('/userSearch', function (req, res) {
  if (req.query.searchValue)
    db.query(
      'SELECT * FROM user_table where phone LIKE "%' +
        req.query.searchValue +
        '%" OR phone LIKE "%' +
        '251' +
        req.query.searchValue.slice(1) +
        '%"  limit 10',
      function (err, rows) {
        if (err) throw err;
        const dataList = [];
        if (rows && rows.length) {
          for (i = 0; i < rows.length; i++) {
            let orgData = {};
            orgData.phone = rows[i].phone;
            orgData.name = rows[i].firstName;
            orgData.info =
              'name: ' +
              rows[i].firstName +
              ' , departure: ' +
              rows[i].startPoint +
              ' & drop off: ' +
              rows[i].endPoint;
            dataList.push(orgData);
          }
          res.json(dataList);
          return;
        }
        res.json([{ phone: 'no user found', info: '' }]);
      }
    );
});

router.post('/addServiceGroup', function (req, res) {
  const msg = {};
  if (req.session.phone) {
    inputData = {
      phone: req.body.phone,
      startPoint: req.body.departure,
      endPoint: req.body.dropOff,
      monthlyPayment: req.body.stipend,
      taskType: req.body.taskCategory,
      assignedBy: req.session.phone,
      name: req.body.name,
      serviceGroup: req.body.serviceGroupName,
      availableVehicleSeat: req.body.capacity,
      leftVehicleSeat: req.body.capacity,
      plateNumber: req.body.plateNumber,
    };

    let sqlForStaffInfo;
    sqlForStaffInfo =
      'SELECT name,assignedBy FROM driver_tasks WHERE phone = ? AND startPoint = ? AND endPoint = ? AND taskType =?';
    db.query(
      sqlForStaffInfo,
      [
        inputData.phone,
        inputData.startPoint,
        inputData.endPoint,
        inputData.taskType,
      ],
      function (err1, data1) {
        if (err1) {
          msg.msg = 'Error while setting up';
          msg.states = 'error';
          res.json(msg);
          console.error(err1);
          return;
        }
        if (data1 && data1.length) {
          msg.msg =
            'This task has already been given to ' +
            data1[0].name +
            ' by ' +
            data1[0].assignedBy;
          msg.states = 'warning';
          res.json(msg);
          return;
        }
        sqlForStaffInfo =
          'SELECT * FROM driver_tasks WHERE phone=?  ORDER BY createdAt DESC';

        const sqlForInsertingTask = 'insert into driver_tasks set ?';

        db.query(
          "SELECT detail FROM `general_info` where infoName = 'routPricePercentage'",
          function (err, result) {
            if (err) console.error(err);

            let percentage;
            if (result && result.length) {
              percentage = result[0].detail;
            }

            const routPrice = (
              (+inputData.monthlyPayment +
                inputData.monthlyPayment *
                  (percentage ? percentage / 100 : 0.2)) /
              inputData.availableVehicleSeat
            ).toFixed(2);

            const routsDetail = {
              startPoint: inputData.startPoint,
              endPoint: inputData.endPoint,
              distanceInKm: req.body.distance,
              estimatedPrice: routPrice,
            };

            const sqlForInsertingRoutPaymentAndDistance = `INSERT INTO routs_with_km_and_price set ? ON DUPLICATE KEY UPDATE distanceInKm=${routsDetail.distanceInKm},estimatedPrice=${routsDetail.estimatedPrice}`;

            db.query(
              sqlForInsertingRoutPaymentAndDistance,
              routsDetail,
              function (err, result) {
                if (err) console.error(err);
              }
            );
          }
        );

        db.query(sqlForInsertingTask, inputData, function (err2) {
          if (err2) {
            msg.msg = 'Error while setting up';
            msg.states = 'error';
            if (err2.code == 'ERDUP_ENTRY') {
              msg.msg = 'task already added';
              console.error(err2);
            } else console.error(err2);

            res.json(msg);
          } else {
            db.query(sqlForStaffInfo, [inputData.phone], function (err, data) {
              if (err) {
                msg.msg = 'Error while setting up';
                msg.states = 'error';
                res.json(msg);
                console.error(err);
                return;
              }
              if (data && data.length) {
                const lowTotal = [];
                for (let i = 0; i < data.length; i++) {
                  const newObj = {};
                  newObj.id = data[i].id;
                  newObj.phone = data[i].phone;
                  newObj.name = data[i].name;
                  newObj.departure = data[i].startPoint;
                  newObj.dropOff = data[i].endPoint;
                  newObj.stipend = data[i].monthlyPayment;
                  newObj.taskCategory = data[i].taskType;
                  newObj.capacity = data[i].availableVehicleSeat;
                  newObj.leftSeats = data[i].leftVehicleSeat;
                  newObj.serviceGroup = data[i].serviceGroup;
                  newObj.plateNumber = data[i].plateNumber;
                  newObj.assignedBy = data[i].assignedBy;

                  lowTotal.push(newObj);
                }
                msg.states = 'success';
                msg.msg = 'driver task added successfully';
                msg.data = lowTotal;
                res.json(msg);
              }
            });
          }
        });
      }
    );
    return;
  }
  msg.states = 'error';
  msg.msg = 'session expired please reload and try again';
  res.json(msg);
});
router.post('/updateServiceGroup', function (req, res) {
  const msg = {};
  if (req.session.phone) {
    inputData = {
      phone: req.body.phone,
      startPoint: req.body.updateDeparture,
      endPoint: req.body.updateDropOff,
      monthlyPayment: req.body.stipendUpdate,
      taskType: req.body.updateTaskCategory,
      assignedBy: req.session.phone,
      name: req.body.name,
      serviceGroup: req.body.serviceUpdateGroupName,
      availableVehicleSeat: req.body.capacity,
      leftVehicleSeat: req.body.capacity,
      plateNumber: req.body.plateNumber,
    };

    const serviceUpdateQuery = `UPDATE driver_tasks SET ? WHERE serviceGroup ='${req.body.oldServiceGroupName}'`;

    db.query(serviceUpdateQuery, inputData, function (err, result) {
      if (err) {
        msg.states = 'error';
        msg.msg = "can't update service group!";
        res.json(msg);
        return;
      }
      if (result.affectedRows) {
        msg.states = 'success';
        msg.msg = 'service successfully updated';
        res.json(msg);
        return;
      }
      msg.states = 'warning';
      msg.msg = 'no service is updated';
      res.json(msg);
    });
    return;
  }
  msg.states = 'error';
  msg.msg = 'session expired please reload and try again';
  res.json(msg);
});

router.post('/removeServiceGroup', function (req, res) {
  const msg = {};

  if (req.session.phone) {
    const sql = 'DELETE FROM driver_tasks WHERE id = ?';
    db.query(
      `select user_table.firstName,user_table.phone,user_table.serviceGroup from user_table join driver_tasks on driver_tasks.id = ${req.body?.id?.trim()} where driver_tasks.serviceGroup = user_table.serviceGroup LIMIT 1`,
      function (err, result) {
        if (err) {
          msg.msg = 'Error while removing';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
          return;
        }

        if (!(result && result.length)) {
          removeService();
          return;
        }
        msg.msg = `service not empty move ${result[0].firstName} ${result[0].phone} before removing service`;
        msg.states = 'warning';
        res.json(msg);
        return;
      }
    );
    function removeService() {
      db.query(sql, [req.body.id], function (err) {
        if (err) {
          msg.msg = 'Error while removing';
          msg.states = 'error';
          res.json(msg);
          console.error(err);
        } else {
          let sqlForServiceList;

          sqlForServiceList =
            'SELECT * FROM driver_tasks where phone=?  ORDER BY createdAt DESC';
          db.query(sqlForServiceList, [req.body.phone], function (err, data) {
            if (err) {
              msg.msg = 'Error while finding info ';
              msg.states = 'error';
              res.json(msg);
              console.error(err);
              return;
            } else {
              if (data && data.length) {
                const listItems = [];
                for (let i = 0; i < data.length; i++) {
                  const newObj = {};
                  newObj.id = data[i].id;
                  newObj.phone = data[i].phone;
                  newObj.name = data[i].name;
                  newObj.departure = data[i].startPoint;
                  newObj.dropOff = data[i].endPoint;
                  newObj.stipend = data[i].monthlyPayment;
                  newObj.taskCategory = data[i].taskType;
                  newObj.capacity = data[i].availableVehicleSeat;
                  newObj.leftSeats = data[i].leftVehicleSeat;
                  newObj.serviceGroup = data[i].serviceGroup;
                  newObj.plateNumber = data[i].plateNumber;
                  newObj.assignedBy = data[i].assignedBy;

                  listItems.push(newObj);
                }
                msg.states = 'success';
                msg.msg = 'Service successfully removed';
                msg.data = listItems;
                res.json(msg);
              } else {
                msg.msg = 'No task available';
                msg.states = 'warning';
                msg.data = [];
                res.json(msg);
              }
            }
          });
        }
      });
    }
    return;
  }

  msg.states = 'error';
  msg.msg = 'unauthorized request';
  res.json(msg);
});

router.post('/getService', function (req, res) {
  const msg = {};
  sqlForServiceList =
    'SELECT * FROM driver_tasks WHERE phone=?  ORDER BY createdAt DESC';
  db.query(sqlForServiceList, [req.body.phone], function (err, data) {
    if (err) {
      msg.msg = 'Error while setting up';
      msg.states = 'error';
      res.json(msg);
      console.error(err);
    } else if (data && data.length) {
      const listItems = [];
      for (let i = 0; i < data.length; i++) {
        const newObj = {};
        newObj.id = data[i].id;
        newObj.phone = data[i].phone;
        newObj.name = data[i].name;
        newObj.departure = data[i].startPoint;
        newObj.dropOff = data[i].endPoint;
        newObj.stipend = data[i].monthlyPayment;
        newObj.taskCategory = data[i].taskType;
        newObj.capacity = data[i].availableVehicleSeat;
        newObj.leftSeats = data[i].leftVehicleSeat;
        newObj.serviceGroup = data[i].serviceGroup;
        newObj.plateNumber = data[i].plateNumber;
        newObj.assignedBy = data[i].assignedBy;

        listItems.push(newObj);
      }
      // msg.states = "success";
      // msg.msg = "here is the list";
      msg.data = listItems;
      res.json(msg);
    }
  });
});

router.get('/dashboard', function (req, res) {
  const getMaleUserQuery =
    "SELECT COUNT(*) FROM user_table WHERE gender = 'female'";
  const getFemaleUserQuery =
    "SELECT COUNT(*) FROM user_table WHERE gender = 'male";

  const getPlacesQuery = 'SELECT COUNT(*) FROM place_lists';

  const getAvailableServiceGroupQuery =
    "SELECT COUNT(*) FROM driver_tasks where states='available'";

  const getUnavailableServiceGroupQuery =
    "SELECT COUNT(*) FROM driver_tasks where states<>'available'";

  const getMaleDriverQuery =
    "SELECT COUNT(*) FROM driver_table WHERE gender = 'male'";
  const getFemaleDriverQuery =
    "SELECT COUNT(*) FROM driver_table WHERE gender = 'female'";

  // COUNT(*)
});
module.exports = router;
