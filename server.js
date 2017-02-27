'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var EnergyUsage = require('./models/energy-usage');

mongoose.connect('mongodb://mongo:27017/energy-usage');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));;

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

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

energyUsageRoute.get(function(req, res) {
  // Use the Beer model to find a specific beer
    res.send('get energy-usage');
});


// Register all our routes with /api
app.use('/api', router);

app.listen(port);
console.log('Running on http://localhost:' + port);
