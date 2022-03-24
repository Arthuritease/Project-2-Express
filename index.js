const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
// const MongoUtil = require("./mongoUtil");
const { connect, getDB } = require("./mongoUtil");

// Three parts of an Express application

// Setup
const app = express();

// enable JSON data processing
app.use(express.json());

// enable CORS
app.use(cors());

async function main() {
  await connect(process.env.MONGO_URI, "just_face_it");

  // "landing page with tagline"
  app.get("/", (req, res) =>
    res.send("<h1 style=color:red>WANT GOOD SKIN THEN USE SUNSCREEN!</h1>")
  );
  // testing api to display routines from DB
  app.get("/routines", async function (req, res) {
    const data = await getDB().collection("routines").find({}).toArray();
    res.send(data);
  });
}
// testing
// app.get("/", (req, res) =>
//   res.send("<h1 style=color:red>ELLO! RUNNING OR NOT NABEI</h1>")
// );
main();
// Listen (must be the last)
app.listen(3000, function () {
  console.log("RUN BABY RUN?!");
});
