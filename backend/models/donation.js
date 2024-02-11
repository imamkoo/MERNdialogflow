const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  message: String,
});

const Donation = mongoose.model("Donation", donationSchema);

// const Donation = new donationSchema({
//   donorName: "user01",
//   amount: 100000,
//   message: "tes",
// });

// Donation.save().then(() => {
//   console.log("save success");
// });

module.exports = Donation;
