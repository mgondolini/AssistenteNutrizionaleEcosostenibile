const mongoose = require('mongoose');

const Product = mongoose.model('Product');

/**
 * Loads a product given its barcode
 */
exports.load_product = async (req, res) => {
  console.log(`Looking for barcode: ${req.params.barcode}...`); // DEBUG

  const query = { code: req.params.barcode };

  await Product.findOne(query)
    .exec()
    .then((product) => {
      if (product == null) {
        res.status(404).send({ description: 'Product not found' });
        console.log(`Product${req.params.barcode}not found`); // DEBUG
      } else {
        res.json(product);
        console.log(`Product found ->${product.barcode}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};
