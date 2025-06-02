const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const customerSchema = mongoose.Schema({
  isGold: Boolean,
  name: { type: String, required: true },
  phone: { type: String, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);

// Create customer
async function createCustomer() {
  const customer = new Customer({
    isGold: false,
    name: "Customer 1",
    phone: "12345",
  });

  try {
    const result = await customer.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) console.log(ex.errors[field].message);
  }
}

// createCustomer();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send([customers]);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid customer ID.");

  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("No such customer found with given ID");
  res.send(customer);
});

router.post("/", async (req, res) => {
  let customer = new Customer(req.body);

  try {
    const result = await customer.save();
    res.send(result);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");
    res.send(customer);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res.status(404).send("The customer with the given ID was not found");

  res.send(customer);
});

module.exports = router;
