const mongoose = require('mongoose');

const Product = mongoose.model('Product');

exports.load_product = function (req, res) {
  console.log(`Looking for barcode: ${req.params.barcode}...`); // DEBUG
  const query = { code: req.params.barcode };

  Product.findOne(query, (err, product) => {
    if (!err) {
      // TODO: migliorare gestione errori
      if (product == null) {
        res.status(404).send({ description: 'product not found' });
        console.log('product not found'); // DEBUG
      } else {
        res.json(product);
        console.log(`product found ->${product.barcode}`); // DEBUG
      }
    } else {
      console.log('error while loading product'); // DEBUG
      res.send(err);
    }
  });
};
