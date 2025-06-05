const winston = require("winston");
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const home = require("./routes/home");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

app.use(express.json());

// Use routers
app.use("/", home);
app.use("/vidly/api/genres", genres);
app.use("/vidly/api/movies", movies);
app.use("/vidly/api/customers", customers);
app.use("/vidly/api/rentals", rentals);
app.use("/vidly/api/users", users);
app.use("/vidly/api/auth", auth);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
