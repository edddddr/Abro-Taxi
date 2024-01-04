const express = require("express");
const router = express.Router();
global.__basedir = __dirname;
const db = require("../config/db2.js");

router.get("/login", function (req, res) {
  res.render("loginForm.ejs");
});

router.get("/", function (req, res) {
  req.session.loggedInUser = false;
  res.render("index.ejs");
});

function reformatPhone(phone) {
  if (!phone) return false;
  if (phone.slice(0, 1).trim() === "0" && phone.length === 10)
    return phone.replace("0", "+251");

  if (phone.slice(0, 1).trim() === "+" && phone.length === 13) return phone;
  else return false;
}

router.post("/login", function (req, res) {
  let msg = {};
  const phone = req.body.phone;
  const password = req.body.password;
  if (!reformatPhone(phone)) {
    msg.states = "error";
    msg.msg = "Phone number is not valid";
    res.json(msg);
    return;
  }
  const sql =
    "SELECT field,states FROM staff_table WHERE phone =? AND password =?";
  db.query(sql, [reformatPhone(phone), password], function (err, data) {
    if (err) {
      console.error(err);
      res.json({
        states: "error",
        msg: "Something went wrong!",
        data: "",
      });
    } else if (data && data.length) {
      if (data[0].states == "active") {
        if (data[0].field == "management") {
          req.session.loggedInUser = true;
          req.session.phone = phone;
          req.session.field = "management";
          res.json({
            states: "success",
            msg: "login success",
            data: { location: "/management" },
          });
        } else {
          res.json({
            states: "danger",
            msg: "not authorized",
            data: "",
          });
        }
      } else {
        res.json({
          states: "danger",
          msg: "not allowed",
          data: "",
        });
      }
    } else {
      res.json({
        states: "warning",
        msg: "incorrect phone or password",
        data: "",
      });
    }
  });
});

module.exports = router;
