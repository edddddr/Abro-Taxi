const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/books/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const storage3 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/management_post");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload2Profiles = multer({ storage: storage });

const uploadBooks = multer({ storage: storage2 });

const uploadManagementPosts = multer({ storage: storage3 });

module.exports = {
  uploadProfiles: upload2Profiles,
  uploadBooks: uploadBooks,
  uploadManagementPosts: uploadManagementPosts,
};
