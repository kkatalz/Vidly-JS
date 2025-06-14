const winston = require("winston");
const config = require("config");
require("winston-mongodb");

module.exports = function () {
  // HANDLE EXCEPTIONS
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true })
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
  if (process.env.NODE_ENV !== "test") {
    winston.add(new winston.transports.MongoDB({ db: config.get("db") }));
  }
};
