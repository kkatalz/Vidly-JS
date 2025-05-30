const debug = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const app = express();
const movies = require("./routes/movies");
const baseRoute = require("./routes/home");

app.use(express.json());

// Env
console.log(`Env: ${app.get("env")}`);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail server: " + config.get("mail.host"));
console.log("Mail password: " + config.get("mail.password"));

// Use base router
app.use("/", baseRoute);
// Use movies module
app.use("/vidly/api/genres", movies);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
