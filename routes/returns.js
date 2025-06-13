const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const { Rental } = require("../models/rental");
const auth = require("../middleware/auth");

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    if (!req.body.customerId)
      res.status(400).send("customer id is not provided");
    if (!req.body.movieId) res.status(400).send("movie id is not provided");

    const rental = await Rental.findOne({
      "customer._id": req.body.customerId,
      "movie._id": req.body.movieId,
    });
    if (!rental) res.status(404).send("no rental found for the movie/customer");

    if (rental.dateReturned)
      res.status(400).send("rental is already proccessed");

    res.status(401).send("client is not logged in");
  })
);

module.exports = router;
