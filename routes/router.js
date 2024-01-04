module.exports = function (app) {
  const uploads = require("../config/configs.js");
  const upload = uploads.uploadProfiles;
  const managementPostUpload = uploads.uploadManagementPosts;
  const controllers = require("../controllers/controllers.js");

  const profileImages = controllers.profileImages;

  const fetchProfileImg = controllers.fetchProfileImg;

  const fetchImgPosts = controllers.fetchImgPosts;

  const uploadManagementPosts = controllers.uploadManagementPost;

  const fetchRawImgPosts = controllers.fetchRawManagementPost;

  app.post(
    "/profileUpload/",
    upload.fields([{ name: "newimage" }, { name: "smallImage" }]),
    profileImages
  );

  app.post(
    "/uploadManagementPost/",
    managementPostUpload.single("newPost"),
    uploadManagementPosts
  );

  app.get("/fileQuery/", fetchProfileImg);
  app.get("/fechPostImg/", fetchImgPosts);
  app.get("/fetchRawPostImg/", fetchRawImgPosts);
};
