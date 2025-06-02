const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
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

exports.Customer = Customer;
