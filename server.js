'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var EnergyUsage = require('./models/energy-usage');

mongoose.connect('mongodb://localhost:27017/energy-usage');

var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/private/ping', function(req, res) {
  res.json({ message: 'pong' });
});

// -- New Code Below Here -- //

// Create a new route with the prefix /beers
var energyUsageRoute = router.route('/energy-usage');

// Create endpoint /api/beers for POSTS
energyUsageRoute.post(function(req, res) {
  // Create a new instance of the Beer model
  var energyUsage = new EnergyUsage();

  // Set the beer properties that came from the POST data
  energyUsage.customerId = req.body.customerId;
  energyUsage.date = req.body.date;
  energyUsage.amps = req.body.amps;
  energyUsage.consumption = req.body.consumption;

  // Save the beer and check for errors
  energyUsage.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Energy usage saved', data: energyUsage });
  });
});

// Constants
const PORT = 8080;

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
