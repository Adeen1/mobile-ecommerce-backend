require("dotenv").config({ path: "password.env" });
const mongoose = require("mongoose");
const express = require("express");
const router = require("./api");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mongo_pass = process.env.uri;

//  adding router
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);
console.log(process.env.uri);
//connecting mongo db

mongoose.connect(mongo_pass);
app.listen(5000, () => {
  console.log("app is listening on port 5000");
});
