const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// const User = require('./src/models/userModel');
// const Product = require('./src/models/productModel');
// const Meal = require('./src/models/mealModel');

const path = require('path');
const config = require('./config.json');

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

global.log = function log(msg) {
  if (config.debugMode) {
    console.log(msg);
  }
};

mongoose.connect('mongodb://admin:teamASW1920@ds241688.mlab.com:41688/eco-assistant', { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

global.appRoot = path.resolve(__dirname);

const routes = require('./src/routes/routes');

routes(app);

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(3000, () => {
  global.log('Node API server started on port 3000');
  // console.log('');
});
