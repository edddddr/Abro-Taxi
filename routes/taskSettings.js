const express = require("express");
const router = express.Router();
const db = require("../config/db2.js");
const ethiopianDate = require("ethiopian-date");
const moments = require("moment");

// // to display task assign setting
// router.get("/taskAssigningInner", function (req, res) {
//   const sql2 =
//     "SELECT phone,firstName,lastName,field FROM staff_table where states = ? and field = ?";

//   const sql3 = "SELECT placeName FROM place_lists ORDER BY placeName  ASC";

//   db.query(sql2, ["enabled", "driver"], function (err2, data2) {
//     if (err2) {
//       console.error(err2);
//       res.send("some error happened");
//     } else if (data2 && data2.length) {
//       if (req.session.loggedinUser && req.session.field == "management") {
//         db.query(sql3, function (err3, data3) {
//           if (err3) {
//             console.error(err3);
//             res.send("some error happened");
//           } else if (data3 && data3.length) {
//             res.render("taskSettings.ejs", {
//               phone: req.session.phone,
//               staff: data2,
//               places: data3,
//             });
//           }
//         });
//       } else {
//         res.redirect("/login");
//       }
//     } else {
//       res.render("taskSettings.ejs", {
//         phone: req.session.phone,
//         staff: data2,
//       });
//     }
//   });
// });

// router.post("/loadAvailableSeats", function (req, res) {
//   const sqlQuery =
//     "select availableVehicleSeat,plateNumber from staff_table where phone = ?";
//   const msg = {};

//   db.query(sqlQuery, [req.body.phone], function (err, data) {
//     if (err) {
//       msg.states = "error";
//       msg.msg = "cannot load available seats please try again";
//       console.error(err);
//       res.json(msg);
//     } else if (data && data.length) {
//       msg.states = "success";
//       msg.data = data;
//       res.json(msg);
//     }
//   });
// });

// router.post("/addServiceGroup", function (req, res) {
//   if (req.session.phone) {
//     inputData = {
//       phone: req.body.phone,
//       startPoint: req.body.startPoint,
//       endPoint: req.body.endPoint,
//       monthlyPayment: req.body.monthlyPayment,
//       taskType: req.body.taskType,
//       assignedBy: req.body.assignedBy,
//       name: req.body.name,
//       serviceGroup: req.body.serviceGroup,
//       availableVehicleSeat: req.body.availableVehicleSeat,
//       leftVehicleSeat: req.body.availableVehicleSeat,
//       plateNumber: req.body.plateNumber,
//     };

//     const msg = {};
//     let sqlForStaffInfo;
//     const fullDate = new Date();
//     const etDate = ethiopianDate.toEthiopian(
//       fullDate.getFullYear(),
//       fullDate.getMonth() + 1,
//       fullDate.getDate() + 1
//     );

//     sqlForStaffInfo =
//       "SELECT name,assignedBy FROM driverTasks WHERE phone = ? AND startPoint = ? AND endPoint = ? AND taskType =?";
//     db.query(
//       sqlForStaffInfo,
//       [
//         inputData.phone,
//         inputData.startPoint,
//         inputData.endPoint,
//         inputData.taskType,
//       ],
//       function (err1, data1) {
//         if (err1) {
//           msg.msg = "Error while setting up";
//           msg.states = "error";
//           res.json(msg);
//           console.error(err1);
//         } else if (data1 && data1.length) {
//           msg.msg =
//             "This task has been given to " +
//             data1[0].name +
//             " by " +
//             data1[0].assignedBy;
//           msg.states = "warning";
//           res.json(msg);
//         } else {
//           sqlForStaffInfo =
//             "SELECT * FROM driverTasks  ORDER BY createdAt DESC";

//           const sqlForInsertingTask = "insert into driverTasks set ?";

//           db.query(sqlForInsertingTask, inputData, function (err2) {
//             if (err2) {
//               msg.msg = "Error while setting up";
//               msg.states = "error";
//               if (err2.code == "ERDUP_ENTRY") {
//                 msg.msg = err2.sqlMessage;
//                 console.log(err2);
//               } else console.error(err2);

//               res.json(msg);
//             } else {
//               db.query(sqlForStaffInfo, function (err, data) {
//                 if (err) {
//                   msg.msg = "Error while setting up";
//                   msg.states = "error";
//                   res.json(msg);
//                   console.error(err);
//                 } else if (data && data.length) {
//                   const lowTotal = [];
//                   for (let i = 0; i < data.length; i++) {
//                     const newArray = [];
//                     newArray.push(data[i].id);
//                     newArray.push(data[i].phone);
//                     newArray.push(data[i].name);
//                     newArray.push(data[i].startPoint);
//                     newArray.push(data[i].endPoint);
//                     newArray.push(data[i].monthlyPayment);
//                     newArray.push(data[i].taskType);
//                     newArray.push(data[i].availableVehicleSeat);
//                     newArray.push(data[i].leftVehicleSeat);
//                     newArray.push(data[i].serviceGroup);
//                     newArray.push(data[i].plateNumber);
//                     newArray.push(data[i].assignedBy);

//                     lowTotal.push(newArray);
//                   }
//                   msg.states = "success";
//                   msg.data = lowTotal;
//                   res.json(msg);
//                 }
//               });
//             }
//           });
//         }
//       }
//     );
//   }
// });

module.exports = router;
