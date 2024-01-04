const express = require("express"),
  session = require("express-session"),
  bodyParser = require("body-parser");

const registrationRouter = require("./routes/driverRegistration"); // route for driver registration
const loginRouter = require("./routes/loginRoute"); // route for login
const staffRegistrationRouter = require("./routes/staffRegistration"); // route for staff registration
const management = require("./routes/management"); // route for management
const taskSettings = require("./routes/taskSettings"); // route for driver task setting
const paymentPage = require("./routes/payment"); // route for driver task setting

const path = require("path");
global.__basedir = __dirname;
const con = require("./config/db2.js");
const uuid = require("uuid");
const crypto = require("crypto");

const app = express();
require("./routes/router.js")(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "123456cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.set("view engine", "jade");
app.use("/", registrationRouter);
app.use("/", loginRouter);
app.use("/", staffRegistrationRouter);
app.use("/", management);
app.use("/", taskSettings);
app.use("/", paymentPage);

app.use(express.static(__dirname + "public"));
app.use(express.static(__dirname + "/"));

const getRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

// password encryption
const sha512 = function (password, salt) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const value = hash.digest("hex");

  return {
    salt: salt,
    passwordHash: value,
  };
};

// password decryption key
function saltHashPassword(userPassword) {
  const salt = getRandomString(16);
  const passwordData = sha512(userPassword, salt);
  return passwordData;
}

// checking for hash password
function checkHashPassword(userPassword, salt) {
  const passwordData = sha512(userPassword, salt);
  return passwordData;
}

app.post("/username", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT username,userId,userStates,userType FROM userTable where phone = ?",
    [phoneNum],
    function (err, result, fields) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      if (result && result.length) {
        // username = result[0].username;
        res.json(result[0]);
      } else {
        res.json("userNot_exists");
      }
    }
  );
});

app.post("/StaffUsername", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT email,states,userType FROM staff_table where phone = ?",
    [phoneNum],
    function (err, result) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      if (result && result.length) {
        // username = result[0].username;
        res.json(result[0]);
      } else {
        res.json("userNot_exists");
      }
    }
  );
});

app.get("/userInfo", function (req, res, next) {
  const emailAddress = req.body.email;
  const password = req.body.password;
  const sql =
    "SELECT userId,username,phone,userStates,created FROM userTable limit 30";
  con.query(sql, function (err, data, fields) {
    if (err) throw err;
    if (data && data.length) {
      const lowTotal = [];
      for (let i = 0; i < data.length; i++) {
        const newArray = [];

        newArray.push(data[i].userId);
        newArray.push(data[i].username);
        newArray.push(data[i].phonNum);
        newArray.push(data[i].userStates);
        newArray.push(data[i].created);

        lowTotal.push(newArray);
      }
      res.json(lowTotal);
      console.log(lowTotal);
    } else {
      res.render("loginForm.ejs", {
        email: emailAddress,
        alertMsg: "Your Email Address or password is incorrect",
      });
    }
  });
});

app.post("/register", (req, res, next) => {
  const postData = req.body;
  const uid = uuid.v4();
  const phoneNum = postData.phoneNum;
  const name = postData.name;
  const fName = postData.fName;
  const gName = postData.gName;
  const gender = postData.gender;
  const username = name + " " + fName + " " + uid.toString().slice(0, 4);
  const aditionalPhone = postData.additionalContact;
  const email = postData.email;
  const organizationName = postData.organizationName;
  const livingAdress = postData.residence;
  const states = "active";

  con.query(
    "SELECT phone FROM userTable where phone = ?",
    [phoneNum],
    function (err, result) {
      if (err) {
        res.send("Error");
        return;
      }

      if (result && result.length) {
        // con.query('UPDATE userTable SET `phone` = ?,`name` = ?, `fname` = ?, `gname` = ?, `username` = ?,`aditionalPhone` = ?,`email` = ?, `organizationName` = ?, `livingAdress` = ?, `gender` = ?,userStates=?,`created` = NOW() where `phone` = ?',[phoneNum,name,fName,gName,username,aditionalPhone,email,organizationName,livingAdress,gender,states,phoneNum],function(err){
        //     if(err){
        //         res.json("err");
        //         console.log(err);
        //         return;
        //     }

        //     res.end(JSON.stringify("RegisterSuccessful"));
        // });

        res.end(JSON.stringify("userPresent"));
      } else {
        con.query(
          "INSERT INTO `userTable`(`phone`, `userId` ,`name`, `fname`, `gname`, `username`,`aditionalPhone`,`email`, `organizationName`, `livingAdress`, `gender`,`created`) VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW())",
          [
            phoneNum,
            uid,
            name,
            fName,
            gName,
            userName,
            aditionalPhone,
            email,
            organizationName,
            livingAdress,
            gender,
          ],
          function (err, result, fields) {
            if (err) {
              res.json("err");
              console.log(err);
              return;
            }

            res.end(JSON.stringify("RegisterSuccessful"));
          }
        );
      }
    }
  );
});

app.post("/serviceBook", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const start = postData.start;
  const endPoint = postData.endPoint;
  const typeOfOrder = postData.typeOfOrder;
  const typeOfCar = postData.typeOfCar;

  console.log(req.body);

  con.query(
    "SELECT phone FROM userTable where phone = ?",
    [phoneNum],
    function (err, result) {
      if (err) {
        res.json("Error");
        return;
      } else if (result && result.length) {
        con.query(
          "UPDATE `userTable` SET `startPoint`=?,`endPoint`=?,`typeOfOrder`=?,`typeOfCar`=?,reorder = ?,`orderDate`= NOW()  WHERE `phone`=?",
          [start, endPoint, typeOfOrder, typeOfCar, "no", phoneNum],
          function (err, result) {
            if (err) {
              res.send(err);
              console.log(err);
              return;
            }
            if (result.changedRows > 0) {
              res.send("RegisterSuccessful");
            } else {
              res.send("NotSuccessful");
            }

            console.log(result);
          }
        );
      }
    }
  );
});

app.post("/loginCheck", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT userStates FROM userTable where phone = ?",
    [phoneNum],
    function (err, result, fields) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      if (result && result.length) {
        userStates = result[0];
        if (userStates.userStates.toString() == "active") {
          res.send("activeUser");
          console.log("activeUser");
        } else if (userStates.userStates.toString() == "inactive") {
          res.send("blockedUser");
        } else if (userStates.userStates.toString() == "allowed") {
          res.send("allowedUser");
        } else {
          res.send("unknown");
        }
      } else {
        res.send("userNot_exists");
      }
    }
  );
});

app.post("/myOrders", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  const msg = {};

  con.query(
    "SELECT username,startPoint,endPoint,typeOfOrder,typeOfCar,paymentStates,serviceGroup,reorder FROM userTable where phone = ?",
    [phoneNum],
    function (err, result) {
      userStates = result[0];

      if (err) {
        console.log(err);
        res.end("something happened while loading your services");
        return;
      }

      if (result && result.length) {
        const userName = result[0].userName.slice(
          0,
          result[0].userName.length - 5
        );

        con.query(
          "SELECT plateNumber FROM driverTasks where serviceGroup = ?",
          [result[0].serviceGroup],
          function (err1, result1) {
            if (err1) {
              console.error(err1);
              msg.states = "err";
              res.json(JSON.stringify(msg));
            } else if (result1 && result1.length) {
              msg.states = "success";
              msg.msg =
                " ስም: " +
                userName +
                "\n መነሻ: " +
                result[0].startPoint +
                "\n መድረሻ: " +
                result[0].endPoint +
                "\n የትእዛዝ አይነት: " +
                result[0].typeOfOrder +
                "\n Payment states: " +
                result[0].paymentStates +
                "\n Service group: " +
                result[0].serviceGroup +
                "\n Plate number: " +
                result1[0].plateNumber;
              msg.reorder = result[0].reorder;
              res.send(JSON.stringify(msg));
            } else {
              msg.states = "success";
              msg.msg =
                " ስም: " +
                userName +
                "\n መነሻ: " +
                result[0].startPoint +
                "\n መድረሻ: " +
                result[0].endPoint +
                "\n የትእዛዝ አይነት: " +
                result[0].typeOfOrder +
                "\n Payment states: " +
                result[0].paymentStates +
                "\n Service group: " +
                result[0].serviceGroup;
              res.send(JSON.stringify(msg));
            }
          }
        );
      } else {
        res.end("no service present");
      }
    }
  );
});

app.post("/checkAdmin", (req, res) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT flag FROM staff_table where phone = ?",
    [phoneNum],
    function (err, result) {
      if (err) {
        console.log(err);
        res.end("userNot_exist");
        return;
      }
      if (result && result.length) {
        userStates = result[0];
        console.log(userStates["flag"]);
        if (userStates["flag"] == "1") {
          res.end("activeUserAdmin");
          console.log("activeUserAdmin");
        } else if (userStates["flag"] == "2") {
          res.end("blockedAdmin");
          console.log("blockedAdmin");
        } else if (userStates["flag"] == "0") {
          res.end("register");
          console.log("register");
        }
      } else {
        res.end("userNot_exist");
      }
    }
  );
});

app.post("/adminRegister", (req, res, next) => {
  const postData = req.body,
    uid = uuid.v4(),
    plaintPassword = postData.Password,
    hashData = saltHashPassword(plaintPassword),
    password = hashData.passwordHash,
    salt = hashData.salt,
    phoneNum = postData.phoneNum,
    name = postData.name,
    fName = postData.fName,
    email = postData.email,
    RegCode = postData.RegCode,
    userType = "admin",
    flag = 2;

  con.query(
    "SELECT regCode FROM managementData where regCode = ?",
    [RegCode],
    function (err, result) {
      if (err) {
        res.json("Error");
        console.log(err);
        return;
      }

      if (result && result.length) {
        con.query(
          "SELECT phone FROM staff_table where phone = ?",
          [phoneNum, email],
          function (err, result) {
            if (err) {
              res.json(err.sqlMessage);
              console.log(err);
              return;
            }

            if (result && result.length) {
              con.query(
                "UPDATE `staff_table` SET `firstName`=?,`lastName`=?,`userType`=?,`flag`=?,`encryptedPassword`=?,`salt`=?,`regCode`=?,`updated`= NOW()  WHERE `phone`=?",
                [
                  name,
                  fName,
                  userType,
                  flag,
                  password,
                  salt,
                  RegCode,
                  phoneNum,
                ],
                function (err, result) {
                  if (err) {
                    res.json(err.sqlMessage);
                    console.log(err);
                    return;
                  }

                  res.json("RegisterSuccessful");
                }
              );
            } else {
              con.query(
                "INSERT INTO `staff_table`(`phone`,`firstName`,`lastName`,field, `encryptedPassword`, `salt`, email, `regCode`, `userType`,`flag`,`createdAt`) VALUES (?,?,?,?,?,?,?,?,?,?,NOW())",
                [
                  phoneNum,
                  name,
                  fName,
                  "management",
                  password,
                  salt,
                  email,
                  RegCode,
                  userType,
                  flag,
                ],
                function (err, result) {
                  if (err) {
                    if (err.code == "ERDUP_ENTRY")
                      res.json(
                        "This email address has been taken please use different email address!"
                      );
                    else res.json(err.sqlMessage);
                    console.log(err);
                    return;
                  }

                  res.json("RegisterSuccessful");
                }
              );
            }
          }
        );
      } else {
        res.json("incorrectRegistrationCode");
      }
    }
  );
});

app.post("/adminLogin", (req, res, next) => {
  const postData = req.body;

  const userPassword = postData.Password,
    phoneNum = postData.phoneNum;

  con.query(
    "SELECT * FROM staff_table where phone = ?",
    [phoneNum],
    function (err, result, fields) {
      const data = result[0];

      if (err) {
        res.end(JSON.stringify("Error"));
        console.error(err);
      } else if (result && result.length) {
        const salt = data["salt"];
        const encryptedPassword = data["encryptedPassword"];
        const hashedPasword = checkHashPassword(
          userPassword,
          salt
        ).passwordHash;

        if (encryptedPassword == hashedPasword) {
          res.end(JSON.stringify("successLogin"));
        } else {
          res.end(JSON.stringify("WrongPassword"));
          console.log(salt);
        }
      } else {
        res.json("UserNot_exists");
      }
    }
  );
});

app.post("/fetchUserInfo", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT username,userId,userStates FROM userTable where phone = ?",
    [phoneNum],
    function (err, result, fields) {
      if (err) {
        console.log(err);
        return;
      }
      if (result && result.length) {
        userStates = result[0];
        if (userStates.userStates.toString() == "active") {
          res.json(result[0]);
          console.log(JSON.stringify(result[0]));
        } else {
          res.end(JSON.stringify("blockedUser"));
          console.log(userStates.userStates);
        }
      } else {
        res.json("userNot_exists");
      }
    }
  );
});

app.get("/fetchUsers", (req, res, next) => {
  con.query(
    "SELECT username,userId,userStates,created,userType,paymentStates,serviceGroup,phone FROM userTable order by id desc",
    function (err, result, fields) {
      if (err) {
        res.send("Error");
        console.error(err);
        return;
      }
      if (result && result.length) {
        res.json(result);
      }
    }
  );
});

app.get("/fetchStaffs", (req, res, next) => {
  con.query(
    "SELECT firstName,lastName,email,states,userType,plateNumber,field,phone,createdAt FROM staff_table order by id desc",
    function (err, result) {
      if (err) {
        res.send("Error");
        console.error(err);
        return;
      } else if (result && result.length) {
        res.json(result);
      } else res.json([]);
    }
  );
});

app.post("/addStaffSetting", (req, res, next) => {
  const postData = req.body;
  const email = postData.email;
  const setting = postData.setting;
  const joinerEmail = postData.joinerEmail;
  let newSetting;

  con.query(
    "SELECT email,states FROM staff_table where email = ?",
    [email],
    function (err, result) {
      if (err) {
        res.send("Error");
        console.error(err);
        return;
      }

      if (result && result.length) {
        if (setting === "Enable Staff") {
          newSetting = "enabled";
          con.query(
            "UPDATE staff_table SET states=?,`updatedBy`=?,`updated`= NOW()  WHERE `email`=?",
            [newSetting, joinerEmail, email],
            function (err, result) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Disable Staff") {
          newSetting = "disabled";
          con.query(
            "UPDATE staff_table SET states=?,flag = ?,`updatedBy`=?,`updated`= NOW()  WHERE `email`=?",
            [newSetting, 0, joinerEmail, email],
            function (err, result) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Make admin") {
          newSetting = "admin";
          con.query(
            "UPDATE `staff_table` SET `userType`=?,`updatedBy`=?,`updated`= NOW()  WHERE `email`=?",
            [newSetting, joinerEmail, email],
            function (err, result) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        }
      }
    }
  );
});

app.post("/addSetting", (req, res, next) => {
  const postData = req.body;
  const userUniqueId = postData.userId;
  const setting = postData.setting;
  const joinerId = postData.adminId;
  let newSetting;

  con.query(
    "SELECT userId,userStates FROM userTable where userId = ?",
    [userUniqueId],
    function (err, result, fields) {
      if (err) {
        res.send("Error");
        return;
      }

      if (result && result.length) {
        if (setting === "Activate user") {
          newSetting = "active";
          con.query(
            "UPDATE `userTable` SET `userStates`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Deactivate user") {
          newSetting = "inactive";
          con.query(
            "UPDATE `userTable` SET `userStates`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Make teacher") {
          newSetting = "teacher";
          con.query(
            "UPDATE `userTable` SET `userType`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Make admin") {
          newSetting = "admin";
          con.query(
            "UPDATE `userTable` SET `userType`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Make student") {
          newSetting = "student";
          con.query(
            "UPDATE `userTable` SET `userType`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        } else if (setting === "Allow register") {
          newSetting = "allowed";
          con.query(
            "UPDATE `userTable` SET `userStates`=?,`updatedBy`=?,`updated`= NOW()  WHERE `userId`=?",
            [newSetting, joinerId, userUniqueId],
            function (err, result, fields) {
              if (err) {
                res.send(err);
                console.error(err);
                return;
              }
              res.send("Successful");
            }
          );
        }
      }
    }
  );
});

app.post("/adminBeforeLoginCheck", (req, res, next) => {
  const postData = req.body;
  const phoneNum = postData.phoneNum;
  const userStates = {};

  con.query(
    "SELECT states FROM staff_table where phone",
    [phoneNum],
    function (err, result) {
      if (err) {
        console.error(err);
        res.send(err);
        return;
      }
      if (result && result.length) {
        userStates = result[0];
        if (userStates.states.toString() == "active") {
          res.send("activeUser");
          console.log("activeUser");
        } else if (userStates.states.toString() == "inactive") {
          res.send("blockedUser");
        }
      } else {
        res.send("userNot_exists");
        console.log("userNot_exists");
      }
    }
  );
});

app.get("/getPostText/", (req, res) => {
  const msg = {};

  con.query(
    "SELECT title,detail FROM managementPosts where place = ?",
    [req.query.order],
    function (err, result) {
      if (err) {
        msg.states = "error";
        res.send(JSON.stringify(msg));
        console.error(err);
      }
      if (result && result.length) {
        msg.states = "success";
        msg.title = result[0].title;
        msg.detail = result[0].detail;

        res.send(JSON.stringify(msg));
      } else {
        msg.states = "noData";

        res.send(JSON.stringify(msg));
      }
    }
  );
});

app.get("/places", function (req, res) {
  const msg = {};

  const sql3 = "SELECT placeName FROM place_lists ORDER BY placeName  ASC";

  db.query(sql3, function (err3, data3) {
    if (err3) {
      console.error(err3);
      msg.states = "err";
      msg.msg = "some error happened";
      res.json(msg);
    } else if (data3 && data3.length) {
      data3.states = "success";
      res.json(data3);
    }
  });
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});
