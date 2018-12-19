const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
// Retry connection
const connectWithRetry = () => {
  console.log("MongoDB connection with retry");
  return mongoose
    .connect(
      "mongodb://mongo:27017/docker-node-mongo",
      { useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.log(`MongoDB connection error: ${err}`);
  setTimeout(connectWithRetry, 5000);
});

connectWithRetry();

const Item = require("./models/Item");

app.get("/", (req, res) => {
  Item.find()
    .then(items => res.render("index", { items }))
    .catch(err => res.status(404).json({ msg: "No items found" }));
});

app.post("/item/add", (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect("/"));
});

const port = 3000;

app.listen(port, () => console.log("Server running..."));
