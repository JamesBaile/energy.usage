'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var EnergyUsage = require('./models/energy-usage');

// Use environment defined port or 3000
var port = process.env.PORT || 3000;
var mongoConnection = process.env.MONGO || 'mongodb://mongo:27017/energy-usage';

console.log(mongoConnection);

mongoose.connect(mongoConnection);
mongoose.Promise = global.Promise;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create our Express router
var router = express.Router();

router.get('/private/ping', function(req, res) {
  res.json({ message: 'pong' });
});

router.get('/health', function(req, res) {
  res.json({ serviceName: 'energy.usage', version: "1.0.0.1", isOk: true });
});


// -- New Code Below Here -- //

var consumptionRoute = router.route('/energy-consumption');

function date_by_subtracting_days(date, days) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - days,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
}

consumptionRoute.get(
  function(req, res) {
    // Use the Beer model to find all beer
    var d = new Date();
    var range = {
        $gte: date_by_subtracting_days(d,1).toISOString(),
        $lt: d.toISOString()
    }
    EnergyUsage.find({date: range},function(err, values) {
      if (err)
        res.send(err);

        var result = { consumption : 0};

        values.forEach(function(element) {
            result.consumption = result.consumption + element.consumption;
        });

      res.json(result);
    });
  }
);

//privacy
var privacyRoute = router.route('/privacy');

privacyRoute.get(function(req, res) {
      res.send('<html><body><p>We will use your Facebook email address to link accounts only.</p></body></html>');
});



var energyUsageRoute = router.route('/api/energy-usage');

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

// Create endpoint /api/energy-usage for GET
energyUsageRoute.get(function(req, res) {
  // Use the Beer model to find all beer
  EnergyUsage.find(function(err, usage) {
    if (err)
      res.send(err);

    res.json(usage);
  });
});

// Create a new route with the /beers/:beer_id prefix
var usageRoute = router.route('/api/usage/:usage_id');

usageRoute.get(function(req, res) {
  EnergyUsage.findById(req.params.usage_id, function(err, usage) {
    if (err)
      res.send(err);

    res.json(usage);
  });
});


usageRoute.put(function(req, res) {
  // Use the Beer model to find a specific beer
  EnergyUsage.findById(req.params.usage_id, function(err, usage) {
    if (err)
      res.send(err);

    usage.date = req.body.date;
    usage.amps = req.body.amps;
    usage.consumption = req.body.consumption;

    usage.save(function(err) {
      if (err)
        res.send(err);

      res.json(usage);
    });
  });
});

// Create endpoint /api/beers/:beer_id for DELETE
usageRoute.delete(function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  EnergyUsage.findByIdAndRemove(req.params.usage_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Usage removed' });
  });
});

// Register all our routes with /api
app.use('/', router);

app.listen(port);
console.log('Running on http://localhost:' + port);

if (process.env.NODE_ENV === 'dev') {
  app.use((err, req, res, next) => {
    res.status(err.status).send({
      status: err.status,
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  console.log(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
});
