const winston = require("winston");
require("winston-mongodb");
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

// Catch uncaught exceptions
/*
process.on("uncaughtException", (ex) => {
  console.log("We got an uncaught exception");
  winston.error(ex.message, ex);
  process.exit(1);
});

// Catch unhadled promise rejection
process.on("unhandledRejection", (ex) => {
  console.log("We got an unhadled promise rejection");
  winston.error(ex.message, ex);
  process.exit(1);
});
*/

// TO AUTOMATE TWO EXCEPTIONs ABOUT  USE WINSTON
winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);
process.on("unhandledRejection", (ex) => {
  throw ex;
});

// Save errors by winston logger in file
winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);
// Save errors to mongodb
winston.add(
  new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
);

// SET AN ERROR OUTSIDE OF THE MAIN ROUTES
// throw new Error("TEST UNCAUGHT EXCEPTION");

// SET PROMISE REJECTION
const p = Promise.reject(new Error("Something failed miserably!"));
p.then(() => console.log("Done"));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/vidly")
  .then(() => console.log("Connected to MongoDb..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

app.use(express.json());

// Use routers
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
