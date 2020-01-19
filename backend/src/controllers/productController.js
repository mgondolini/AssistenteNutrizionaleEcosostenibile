const mongoose = require('mongoose');

const Product = mongoose.model('Product');

/** Loads a product given its barcode */
exports.load_product = async (req, res) => {
  console.log(`Looking for barcode: ${req.query.barcode}...`); // DEBUG

  const query = { code: req.query.barcode };

  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        res.status(400).send({ description: 'product_not_found' });
        console.log(`Product${req.query.barcode} not found`); // DEBUG
      } else {
        res.status(200).json(product);
        console.log(`Product found ->${product.barcode}`); // DEBUG
      }
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};

/** Inserts a new product if not found in the database */
exports.insert_product = async (req, res) => {
  const query = { code: req.body.code };
  console.log(JSON.stringify(req.body.code)); // DEBUG

  // Prima di inserire il prodotto verifico che non sia già nel db
  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        console.log(`Product${req.body.barcode}not found -> Creating...`); // DEBUG
        // Se non trovo il prodotto ne creo uno nuovo
        this.createNewProduct(req, res);
      } else {
        // Se trovo il prodotto mando quello
        res.status(200).json(product);
        console.log(`Product found ->${JSON.stringify(product)}`); // DEBUG
      }
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};

/** Creates a new product and inserts it in the database */
exports.createNewProduct = (req, res) => {
  const newProduct = new Product(req.body);

  console.log(JSON.stringify(newProduct)); // DEBUG

  newProduct.save()
    .then((product) => {
      console.log(`product created -> ${product}`); // DEBUG
      res.status(201).json(product);
    })
    .catch((err) => {
      console.log(`error while creating new product${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};
