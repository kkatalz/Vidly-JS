const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth");

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    if (!req.body.customerId)
      res.status(400).send("customer id is not provided");
    if (!req.body.movieId) res.status(400).send("movie id is not provided");

    res.status(401).send("client is not logged in");
  })
);

module.exports = router;
