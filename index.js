const mongoose = require("mongoose");
const express = require("express");
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

app.use(express.json());

// Use routers
app.use("/", home);
app.use("/vidly/api/genres", genres);
app.use("/vidly/api/customers", customers);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
