const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config.json');

const app = express();
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50MB' }));

global.log = function log(msg) {
  if (config.debugmode) {
    console.log(msg);
  }
};

mongoose.connect('mongodb://admin:teamASW1920@ds241688.mlab.com:41688/eco-assistant', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

// 'mongodb://admin:teamASW1920@ds241688.mlab.com:41688/eco-assistant'
// 'mongodb://localhost:27017/eco-assistant'

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// TODO insert here the require for every db schema you need
require('./src/models/whoModel');
require('./src/models/userModel');
require('./src/models/productModel');
require('./src/models/mealModel');

global.appRoot = path.resolve(__dirname);

const port = process.env.PORT || config.port || 3001;
const publicRoutes = require('./src/routes/publicRoutes');
const routes = require('./src/routes/routes');

publicRoutes(app);
routes(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(`${__dirname}/public/`));
  app.get(/.*/, (req, res) => res.sendFile(`${__dirname}/public/index.html`));
}

app.use((req, res) => {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

app.listen(port, () => {
  global.log(`Node API server started on port ${port}`);
});
