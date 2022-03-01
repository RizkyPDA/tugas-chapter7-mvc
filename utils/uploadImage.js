const multer = require("multer");
const directory = __dirname + "/../public/images";

const filter = (req, file, cb) => {
  if (file.mimetype.includes("image/jpg") || file.mimetype.includes("image/jpeg") || file.mimetype.includes("image/png")) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, and PNG files are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directory);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 10000);
    cb(null, `${file.originalname.split(".").shift()}-${uniqueSuffix}.${file.originalname.split(".").pop()}`);
  },
});

let uploadImage = multer({
  storage: storage,
  fileFilter: filter,
});

module.exports = uploadImage;
