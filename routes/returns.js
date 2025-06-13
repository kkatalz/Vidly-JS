const express = require("express");
const moment = require("moment");

const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    if (!req.body.customerId)
      return res.status(400).send("customer id is not provided");
    if (!req.body.movieId)
      return res.status(400).send("movie id is not provided");

    const rental = await Rental.findOne({
      "customer._id": req.body.customerId,
      "movie._id": req.body.movieId,
    });
    if (!rental)
      return res.status(404).send("no rental found for the movie/customer");

    if (rental.dateReturned)
      return res.status(400).send("rental is already proccessed");

    rental.dateReturned = new Date();

    const rentalDays = Math.max(1, moment().diff(rental.dateOut, "days"));
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.findByIdAndUpdate(rental.movie._id, {
      $inc: { numberInStock: 1 },
    });

    return res.status(200).send(rental);
  })
);

module.exports = router;
