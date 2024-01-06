const fs = require("fs");
const db = require("../config/dbs.js");
const con = require("../config/db2.js");

const winPublicDir = require("path").join(
  __basedir,
  "resources\\static\\assets\\management_post\\"
);
// const winPublicDir = __basedir+'/resources/static/assets/management_post/';

const profileImages = db.profileImage;
const fetchImgPosts = db.fetchImgPost;
const uploadManagementPosts = db.fetchImgPost;

module.exports = {
  profileImages: (req, res) => {
    profileImages
      .findOne({ where: { phonNum: req.body.phoneNum } })
      .then(function (result) {
        // Check if record exists in db\

        if (result) {
          const newImage = req.files.newImage.map(function (employee) {
            return employee;
          });

          const smallImage = req.files.smallImage.map(function (employee) {
            return employee;
          });

          profileImages
            .update(
              {
                profImg: fs.readFileSync(
                  __basedir +
                    "/resources/static/assets/uploads/" +
                    newImage[0].filename
                ),
                lightProfImage: fs.readFileSync(
                  __basedir +
                    "/resources/static/assets/uploads/" +
                    smallImage[0].filename
                ),
              },
              { where: { phonNum: req.body.phoneNum } }
            )
            .then(function (result) {
              if (result) {
                fs.unlinkSync(
                  __basedir +
                    "/resources/static/assets/uploads/" +
                    newImage[0].filename
                );
                fs.unlinkSync(
                  __basedir +
                    "/resources/static/assets/uploads/" +
                    smallImage[0].filename
                );
                console.log("uploaded successfully!");
                res.end(JSON.stringify("success"));
              } else res.end(JSON.stringify("failed_to_upload"));
            });
        }
      });
  },

  fetchImgPosts: (req, res) => {
    fetchImgPosts
      .findAll({
        attributes: ["place", "title", "detail", "imgName"],
        order: [["place", "ASC"]],
      })
      .then(function (result) {
        if (result) {
          try {
            res.json(result);
          } catch (error) {
            console.error(error);
          }
        } else {
          res.end(JSON.stringify("error loading file!"));
        }
      });
  },

  fetchProfileImg: (req, res) => {
    const postData = req.query;
    const phoneNum = postData.phoneNum;

    con.query(
      "SELECT profImg FROM userTable where phonNum = ?",
      [phoneNum],
      function (err, result, fields) {
        if (err) {
          console.log(err);
          res.json("Error");
          return;
        }

        if (result && result.length) {
          try {
            fs.writeFileSync(
              __basedir + "/resources/static/assets/tmp/" + phoneNum + ".jpg",
              Buffer.from(new Uint8Array(result[0].profImg))
            );
            res.send(
              fs.readFileSync(
                __basedir + "/resources/static/assets/tmp/" + phoneNum + ".jpg"
              )
            );
            console.log(
              fs.readFileSync(
                __basedir + "/resources/static/assets/tmp/" + phoneNum + ".jpg"
              )
            );
          } catch (error) {}
        } else {
          console.log(phoneNum + " error loading image!");
          res.end(JSON.stringify("error loading image!"));
        }
      }
    );
  },

  uploadManagementPost: (req, res) => {
    const postData = req.body;
    const place = postData.place;
    const title = postData.title;
    const detail = postData.detail;
    const imgName = postData.imgName;
    const uploadedBy = postData.uploadedBy;

    uploadManagementPosts
      .findOne({ where: { place: place } })
      .then(function (result) {
        // Check if record exists in db
        if (result) {
          uploadManagementPosts
            .update(
              {
                uploadedBy: uploadedBy,
                place: place,
                title: title,
                detail: detail,
                imgName: imgName,
              },
              { where: { place: place } }
            )
            .then(function (result) {
              if (result) {
                console.log("uploaded successfully!");
                res.send("uploaded_successfully");
              } else res.send("failed_to_upload");
            })
            .catch(function (err) {
              res.send(JSON.stringify(err));
              //   throw err;
            });
        } else {
          uploadManagementPosts
            .create({
              uploadedBy: uploadedBy,
              place: place,
              title: title,
              detail: detail,
              imgName: imgName,
            })
            .then(() => {
              res.send("uploaded_successfully");
            })
            .catch(function (err) {
              res.send(JSON.stringify(err));
              //   throw err;
            });
        }
      });
  },

  fetchRawManagementPost: (req, res) => {
    const postData = req.query;
    const imgName = postData.imgName;

    try {
      if (fs.existsSync(winPublicDir + imgName + ".jpg")) {
        res.send(fs.readFileSync(winPublicDir + imgName + ".jpg"));
      } else {
        res.send("no file: " + winPublicDir + imgName + ".jpg");
      }
    } catch (error) {
      console.error(error);
    }
  },
};
