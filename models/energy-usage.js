var mongoose = require('mongoose');

// Define our beer schema
var EnergyUsageSchema   = new mongoose.Schema({
  customerId: String,
  date: Date,
  amps: Number,
  consumption: Number
});

// Export the Mongoose model
module.exports = mongoose.model('EnergyUsage', EnergyUsageSchema);
