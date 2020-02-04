const mongoose = require('mongoose');

const Product = mongoose.model('Product');
const productControllerUtils = require('./utils/productControllerUtils.js');

/** Loads a product given its barcode */
exports.load_product = async (req, res) => {
  global.log(`Looking for barcode: ${req.query.barcode}...`); // DEBUG

  const query = { code: req.query.barcode };

  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        res.status(400).send({ description: 'product_not_found' });
        global.log(`Product${req.query.barcode} not found`); // DEBUG
      } else {
        res.status(200).send(product);
        global.log(`Product found ->${product.barcode}`); // DEBUG
      }
    })
    .catch((err) => {
      global.log(`Error while loading product: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Loads a product given its barcode and quantity */
exports.load_product_quantity = async (req, res) => {
  global.log(`Looking for barcode: ${req.query.barcode}...`); // DEBUG
  const { barcode } = req.query;
  const { quantity } = req.query;

  const query = { code: barcode };

  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        res.status(400).send({ description: 'product_not_found' });
        global.log(`Product${req.query.barcode} not found`); // DEBUG
      } else {
        global.log(`Product found ->${product.barcode}`); // DEBUG
        const values = productControllerUtils.computeProductValues(barcode, quantity, res);
        if (values !== null || values !== undefined) res.status(200).send(values);
        else res.status(500).send({ description: 'internal_server_error' });
      }
    })
    .catch((err) => {
      global.log(`Error while loading product: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Inserts a new product if not found in the database */
exports.insert_product = async (req, res) => {
  const query = { code: req.body.code };
  global.log(JSON.stringify(req.body.code)); // DEBUG

  // Prima di inserire il prodotto verifico che non sia già nel db
  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        global.log(`Product ${req.body.barcode} not found -> Creating...`); // DEBUG
        // Se non trovo il prodotto ne creo uno nuovo
        this.createNewProduct(req, res);
      } else {
        // Se trovo il prodotto mando quello
        res.status(200).send(product);
        global.log(`Product found -> ${JSON.stringify(product)}`); // DEBUG
      }
    })
    .catch((err) => {
      global.log(`Error while inserting product: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Creates a new product and inserts it in the database */
exports.createNewProduct = (req, res) => {
  const newProduct = new Product(req.body);

  global.log(JSON.stringify(newProduct)); // DEBUG

  newProduct.save()
    .then((product) => {
      global.log(`Product created -> ${product}`); // DEBUG
      res.status(201).send(product);
    })
    .catch((err) => {
      global.log(`Error while creating new product: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};
