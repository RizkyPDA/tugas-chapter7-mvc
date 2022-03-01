require("dotenv").config();

const express = require("express");
const app = express();
const db = require("./models");
const router = require("./router");
const session = require("express-session");
const flash = require("connect-flash");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//   })
// );
// // flash digunakan untuk menampilkan alert notifikasi
// app.use(flash());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(router);

const PORT = process.env.PORT || 3000;

db.sequelize
  .sync({
    // force: true,
  })
  .then(() => {
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log("=============================== ");
      console.log(`Server is running on PORT ${PORT}`);
      console.log("===============================");
    });
  })
  .catch((error) => {
    console.log(error);
  });
