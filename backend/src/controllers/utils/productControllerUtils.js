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
  let energyKjTot;
  let energyKcalTot;
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
  let nutritionScore;
  let carbonFootprintTot;
  let waterFootprintTot;
  let measureUnit;

  const query = { code: barcode };

  await Products.findOne(query)
    .exec()
    .then((product) => {
      productName = product.product_name;
      imageUrl = product.image_url;
      energyKjTot = this.valuePerPortion(product.energy_kj_100g, quantity);
      energyKcalTot = this.valuePerPortion(product.energy_kcal_100g, quantity);
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
      nutritionScore = product.nutrition_score_uk_100g;
      carbonFootprintTot = this.valuePerPortion(product.carbon_footprint_100g, quantity);
      waterFootprintTot = this.valuePerPortion(product.water_footprint_100g, quantity);
      measureUnit = product.measure_unit;
    })
    .catch((err) => {
      global.log(`Error while computing product values: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });

  // Creo il json da ritornare
  // TODO: forse si potrebbe fare anche con il modello new Product() ?
  const values = {
    product_name: productName,
    image_url: imageUrl,
    energy_kj_tot: energyKjTot,
    energy_kcal_tot: energyKcalTot,
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
    nutrition_score: nutritionScore,
    carbon_footprint_tot: carbonFootprintTot,
    water_footprint_tot: waterFootprintTot,
    measure_unit: measureUnit,
  };

  return values;
};
