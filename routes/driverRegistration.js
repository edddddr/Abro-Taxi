const express = require("express");
const router = express.Router();
global.__basedir = __dirname;
const db = require("../config/db2.js");
const uuid = require("uuid");

// to display registration form
router.get("/driverRegister", function (req, res) {
  if (req.session.loggedInUser && req.session.field == "management") {
    res.render("driverRegistrationForm.ejs", {
      phone: req.session.phone,
    });
  } else {
    res.redirect("/login");
  }
});

function checkPass(pass, confirmPass) {
  if (pass && pass.length < 8) {
    return "password-to-short";
  } else if (pass !== confirmPass) return "password-not-matching";
  else "success";
}

// to store user input detail on post request
router.post("/driverRegister", function (req, res) {
  const msg = {};

  if (!req.body || !req.body.phone) {
    msg.msg = "incomplete request";
    msg.states = "error";
    res.json(msg);
    return;
  }

  inputData = {
    phone: req.body.phone,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    phoneNumber: req.body.phone,
  };

  inputData2 = {
    userId: uuid.v4().slice(0, 8),
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
    password: req.body.password,
    typeOfCar: req.body.vehicle,
    modelOfCar: req.body.model,
    capacityOfCar: req.body.seats,
    plateNumber: req.body.plate,
    field: "driver",
    states: "enabled",
  };
  // check unique phone address
  const sql = "SELECT phone FROM driver_table WHERE phone =?";
  db.query(sql, [inputData.phone], function (err, data) {
    if (err) {
      msg.msg = "Error while registering " + inputData.phone;
      msg.states = "error";
      console.error(err);
      res.json(msg);
      return;
    } else if (data && data.length) {
      msg.msg = inputData.phone + " was already registered";
      msg.states = "present";
      res.json(msg);
    } else if (
      checkPass(inputData.password, inputData.confirmPassword) ===
      "password-to-short"
    ) {
      msg.msg = "Password must be at least 8 characters";
      msg.states = "present";
      res.json(msg);
    } else if (
      checkPass(inputData.password, inputData.confirmPassword) ===
      "password-not-matching"
    ) {
      msg.msg = "Password & confirm password are not matching";
      msg.states = "present";
      res.json(msg);
    } else {
      // save users data into database
      const sql = "INSERT INTO driver_table SET ?";
      db.query(sql, inputData2, function (err) {
        if (err) {
          if (err.code == "ER-DUP-ENTRY") {
            msg.msg =
              "Error while registering " +
              inputData.phone +
              "   " +
              err.sqlMessage;
            msg.states = "error";
            res.json(msg);
            console.error(err);
          } else {
            msg.msg = "Error while registering " + inputData.phone;
            msg.states = "error";
            res.json(msg);
            console.error(err);
          }
          return;
        } else {
          msg.msg = inputData.phone + " successfully registered";
          msg.states = "success";
          res.json(msg);
        }
      });
    }
  });
});
module.exports = router;
