const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
//const MongoUtil = require("./mongoUtil");
const { connect, getDB } = require("./mongoUtil");
const req = require("express/lib/request");
// const { urlencoded } = require("express"); WHY THE HECK ARE YOU HERE

// Three parts of an Express application

// Setup
const app = express();

// enable JSON data processing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// enable CORS
app.use(cors());

async function main() {
  await connect(process.env.MONGO_URI, "just_face_it");

  function createProduct(prodObj) {
    // validation
    prodObj._id = new ObjectId();
    let title = req.body.title ? req.body.title : "";
    let type = req.body.type ? req.body.type : "";

    // insertOne
    await;
    // return insert
  }

  // "landing page with tagline"
  app.get("/", (req, res) =>
    res.send("<h1 style=color:red>WANT GOOD SKIN THEN USE SUNSCREEN!</h1>")
  );
  // testing api to display routines from DB
  app.get("/routines", async function (req, res) {
    try {
      const data = await getDB().collection("routines").find().toArray();
      res.send(data);
    } catch (e) {
      res.status(500);
      res.json({
        message: "We can't face you at the moment.. please come back later..",
      });
      console.log(e);
    }
  });
  // allow user to CREATE new routines
  app.post("/routines", async function (req, res) {
    try {
      let products = req.body.products ? req.body.products : "";
      let prodAck = createProduct(products);

      let description = req.body.description ? req.body.description : "";
      let image = req.body.image ? req.body.image : "";
      let title = req.body.title ? req.body.title : "";
      let user_name = req.body.user.name ? req.body.user.name : "";
      let user_email = req.body.user.email ? req.body.user.email : "";
      let skin_type = req.body.skin_type ? req.body.skin_type.split(",") : [];
      let timing = req.body.timing ? req.body.timing.split(",") : [];
      // let comments = req.body.comments;

      // to put into DB

      const db = getDB();

      await db.collection("routines").insertOne({
        description: description,
        image: image,
        title: title,
        user: {
          name: user_name,
          email: user_email,
        },
        skin_type: skin_type,
        products: products,
        timing: timing,
        // comments: comments,
      });
      res.status(200);
      res.json({
        message: "Thank you for your submission xoxo!",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message: "Oh no.. Something went wrong. Please contact us",
      });
      console.log(e);
    }
  });
}

main();
// Listen (must be the last)
app.listen(3000, function () {
  console.log("RUN BABY RUN?!");
});
