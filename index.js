const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();

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

// TO AUTOMATE TWO EXCEPTIONs ABOVE USE WINSTON
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
