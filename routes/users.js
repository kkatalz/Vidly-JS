const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// router.get("/", async (req, res) => {
//   const users = User.find().sort("name");
//   res.send([users]);
// });

// router.get("/:id", async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(400).send("Invalid customer ID.");

//   const user = await User.findById(req.params.id);

//   if (!user) return res.status(404).send("No such user found with given ID");

//   res.send(user);
// });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();
    res.send(user);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

module.exports = router;
