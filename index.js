const mongoose = require("mongoose");
const express = require("express");
const app = express();
const home = require("./routes/home");
const movies = require("./routes/movies");

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

app.use(express.json());

// Use base router
app.use("/", home);
// Use movies module
app.use("/vidly/api/genres", movies);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
