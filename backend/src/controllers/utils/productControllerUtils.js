const mongoose = require('mongoose');

const Products = mongoose.model('Product');


/** Computes value in grams for a portion of a given quantity */
exports.computeValuePerPortion = (value, quantity) => ((value / 100) * quantity);


/** Checks the value before compute the expression */
exports.valuePerPortion = (value, quantity) => {
  let valuePerQuantity;

  if (value != null) valuePerQuantity = this.computeValuePerPortion(value, quantity);
  else valuePerQuantity = 0;

  return valuePerQuantity;
};


/** Computes product values for a given quantity */
exports.computeProductValues = async (barcode, quantity, res) => {
  let productName;
  let imageUrl;
  let energyTot;
  let carbsTot;
  let sugarsTot;
  let fatTot;
  let saturatedFatTot;
  let proteinsTot;
  let fiberTot;
  let saltTot;
  let sodiumTot;
  let alcoholTot;
  let calciumTot;
  let carbonFootprintTot;
  let waterFootprintTot;

  const query = { code: barcode };

  await Products.findOne(query)
    .exec()
    .then((product) => {
      productName = product.product_name;
      imageUrl = product.image_url;
      energyTot = this.valuePerPortion(product.energy_100g, quantity);
      carbsTot = this.valuePerPortion(product.carbohydrates_100g, quantity);
      sugarsTot = this.valuePerPortion(product.sugars_100g, quantity);
      fatTot = this.valuePerPortion(product.fat_100g, quantity);
      saturatedFatTot = this.valuePerPortion(product.saturated_fat_100g, quantity);
      proteinsTot = this.valuePerPortion(product.proteins_100g, quantity);
      fiberTot = this.valuePerPortion(product.fiber_100g, quantity);
      saltTot = this.valuePerPortion(product.salt_100g, quantity);
      sodiumTot = this.valuePerPortion(product.sodium_100g, quantity);
      alcoholTot = this.valuePerPortion(product.alcohol_100g, quantity);
      calciumTot = this.valuePerPortion(product.calcium_100g, quantity);
      carbonFootprintTot = this.valuePerPortion(product.carbon_footprint_100g, quantity);
      waterFootprintTot = this.valuePerPortion(product.water_footprint_100g, quantity);
    })
    .catch((err) => res.status(500).send(err));

  // Creo il json da ritornare
  // TODO: forse si potrebbe fare anche con il modello new Product() ?
  const values = {
    product_name: productName,
    image_url: imageUrl,
    energy_tot: energyTot,
    carbohidrates_tot: carbsTot,
    sugars_tot: sugarsTot,
    fat_tot: fatTot,
    saturated_fat_tot: saturatedFatTot,
    proteins_tot: proteinsTot,
    salt_tot: saltTot,
    sodium_tot: sodiumTot,
    calcium_tot: calciumTot,
    alcohol_tot: alcoholTot,
    fiber_tot: fiberTot,
    carbon_footprint_tot: carbonFootprintTot,
    water_footprint_tot: waterFootprintTot,
  };

  return values;
};
