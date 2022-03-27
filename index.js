const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
//const MongoUtil = require("./mongoUtil");
const { connect, getDB } = require("./mongoUtil");
const req = require("express/lib/request");
const { param } = require("express/lib/request");
const { Db } = require("mongodb");
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

  // function createProduct(prodObj) {
  //   // validation
  //   prodObj._id = new ObjectId();
  //   let title = req.body.title ? req.body.title : "";
  //   let type = req.body.type ? req.body.type : "";

  //   // insertOne
  //   await db.collection("products").insertOne({
  //   // return insert
  // }

  // "landing page with tagline"
  app.get("/", (req, res) =>
    res.send("<h1 style=color:red>WANT GOOD SKIN THEN USE SUNSCREEN!</h1>")
  );
  // To GET all routines from database
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

  // GET routines with search parameters
  // query parameters begins after "?" e.g ? description=simple&body_tags=face
  app.get("/routines/search", async function (req, res) {
    try {
      let parameter = {};
      if (req.query.description) {
        parameter["description"] = {
          $regex: req.query.description,
          $options: "i",
        };
      }
      const filtered = await getDB()
        .collection("routines")
        .find(parameter)
        .toArray();
      if (filtered.length == 0) throw new Error(""); // this line allows "catch" to catch
      res.send(filtered);
    } catch (e) {
      console.log("catching");
      res.status(500);
      res.json({
        message: "aint no routines with your requirements, fam!",
      });
      console.log(e);
    }
  });
  // allow user to CREATE new routines
  app.post("/routines", async function (req, res) {
    try {
      // let products = req.body.products ? req.body.products : "";
      // let prodAck = createProduct(products);

      let description = req.body.description ? req.body.description : "";
      let image = req.body.image ? req.body.image : "";
      let title = req.body.title ? req.body.title : "";
      let user_name = req.body.user.name ? req.body.user.name : "";
      let user_email = req.body.user.email ? req.body.user.email : "";
      let skin_type = req.body.skin_type ? req.body.skin_type.split(",") : [];
      let timing = req.body.timing ? req.body.timing.split(",") : [];
      // let comments = req.body.comments;
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

  //UPDATING routine
  app.put("/routines/:id", async function (req, res) {
    try {
      let description = req.body.description ? req.body.description : "";
      let image = req.body.image ? req.body.image : "";
      let title = req.body.title ? req.body.title : "";
      let user_name = req.body.user.name ? req.body.user.name : "";
      let user_email = req.body.user.email ? req.body.user.email : "";
      let skin_type = req.body.skin_type ? req.body.skin_type.split(",") : [];
      let timing = req.body.timing ? req.body.timing.split(",") : [];
      // let comments = req.body.comments;
      const db = getDB();

      let r = await getDB()
        .collection("routines")
        .updateOne(
          {
            _id: ObjectId(req.params.id),
          },
          {
            $set: {
              description: description,
              // image: image,
              title: title,
              user: {
                name: user_name,
                email: user_email,
              },
              skin_type: skin_type,
              timing: timing,
              // comments: comments
            },
          }
        );
      res.status(200);
      res.json({
        message: "Routine refreshed!",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message: "Oh no.. Something went wrong. Please contact us",
      });
      console.log(e);
    }
  });

  //Allow user to DELETE routine
  app.delete("/routines/:id", async function (req, res) {
    try {
      await getDB()
        .collection("routines")
        .deleteOne({
          _id: ObjectId(req.params.id),
        });
      res.status(200);
      res.json({
        message: "routine deleted",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message: "The routine refuses to be deleted ",
      });
      console.log(e);
    }
  });

  //GET all documents in Products collection
  app.get("/products", async function (req, res) {
    try {
      const data = await getDB().collection("products").find().toArray();
      res.send(data);
    } catch (e) {
      res.status(500);
      res.json({
        message: "We can't face you at the moment.. please come back later..",
      });
      console.log(e);
    }
  });

  // GET documents in Products based on search parameter
  // query parameters begins after "?" e.g ? description=simple&suitability=oily
  app.get("/products/search", async function (req, res) {
    try {
      let parameter = {};
      if (req.query.description) {
        parameter["description"] = {
          $regex: req.query.description,
          $options: "i",
        };
      }
      // this line searches in suitability array
      if (req.query.suitability) {
        parameter["suitability"] = {
          $in: [req.query.suitability],
        };
      }
      if (req.query.type) {
        parameter["type"] = {
          $regex: req.query.type,
          $options: "i",
        };
      }
      if (req.query.name) {
        parameter["name"] = {
          $regex: req.query.name,
          $options: "i",
        };
      }

      const filtered = await getDB()
        .collection("products")
        .find(parameter)
        .toArray();
      if (filtered.length == 0) throw new Error(""); // this line allows "catch" to catch
      res.send(filtered);
    } catch (e) {
      res.status(500);
      res.json({
        message: "aint no products as such, fam!",
      });
      console.log(e);
    }
  });
  // CREATE new product entry into the Products collection
  app.post("/products", async function (req, res) {
    try {
      // let products = req.body.products ? req.body.products : "";
      // let prodAck = createProduct(products);
      let name = req.body.name ? req.body.name : "";
      let type = req.body.type ? req.body.type : "";
      let description = req.body.description ? req.body.description : "";
      let suitability = req.body.suitability ? req.body.suitability : [];

      const db = getDB();

      await db.collection("products").insertOne({
        name: name,
        type: type,
        description: description,
        suitability: suitability,
      });
      res.status(200);
      res.json({
        message: "Thank you for making us more inclusive!",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message: "Oh no.. Something went wrong. Please contact us",
      });
      console.log(e);
    }
  });
  //UPDATING product entries
  app.put("/products/:id", async function (req, res) {
    try {
      // let products = req.body.products ? req.body.products : "";
      // let prodAck = createProduct(products);
      let name = req.body.name ? req.body.name : "";
      let type = req.body.type ? req.body.type : "";
      let description = req.body.description ? req.body.description : "";
      let suitability = req.body.suitability ? req.body.suitability : [];

      const db = getDB();

      let r = await db.collection("products").updateOne(
        {
          _id: ObjectId(req.params.id),
        },
        {
          $set: {
            name: name,
            // image: image,
            type: type,
            description: description,
            suitability: suitability,
          },
        }
      );

      res.status(200);
      res.json({
        message: "Products rejuvenated!",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message: "Oh no.. Something went wrong. Please contact us",
      });
      console.log(e);
    }
  });
  app.delete("/products/:id", async function (req, res) {
    try {
      await getDB()
        .collection("products")
        .deleteOne({
          _id: ObjectId(req.params.id),
        });
      res.status(200);
      res.json({
        message: "product nuked",
      });
    } catch (e) {
      res.status(500);
      res.json({
        message:
          "The product refuses to be go. Try again or contact us for high-level house cleaning ",
      });
      console.log(e);
    }
  });
}

main();
// Listen (must be the last)
app.listen(process.env.PORT, function () {
  console.log("Hang on..");
});
