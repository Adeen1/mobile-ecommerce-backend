require("dotenv").config({ path: "password.env" });
const mongoose = require("mongoose");
const express = require("express");
const router = require("./api");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const mongo_pass = process.env.uri;

app.use(express.static(path.join(__dirname, "build")));

// Route all requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//  adding router
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);
console.log(process.env.uri);
//connecting mongo db

mongoose.connect(mongo_pass);
app.listen(8080, "0.0.0.0", () => {
  console.log("app is listening on port 5000");
});
