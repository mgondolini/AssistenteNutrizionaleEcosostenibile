var express = require('express');
var mongoose = require('mongoose')

const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan') 

var User = require('./src/models/userModel')
var Product = require('./src/models/productModel')
var Meal = require('./src/models/mealModel')

const app = express()
app.use(morgan('combined'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/eco-assistant', { useNewUrlParser: true, useUnifiedTopology: true });
// 'mongodb://admin:teamASW1920@ds241688.mlab.com:41688/eco-assistant'
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
global.appRoot = path.resolve(__dirname);

var routes = require('./src/routes/routes');
routes(app); 

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(3000, function () {
  console.log('Node API server started on port 3000');
});