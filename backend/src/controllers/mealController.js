/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const Meal = mongoose.model('Meals');
const Products = mongoose.model('Product');

/**
 * Loads all the meals for a given user
 */
exports.load_meals_list = async (req, res) => {
  console.log('looking for meal...'); // DEBUG

  const { query } = req;

  await Meal.findOne(query)
    .exec()
    .then((doc) => {
      if (doc.length === 0) {
        res.status(404).send({ description: `Meals not found for user ${req.query.username}` });
        console.log(`Meals not found for user ${req.query.username}`); // DEBUG
      } else {
        res.status(200).json(doc);
        console.log(`Meals list for user ${req.query.username}:\n${doc}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};


/**
 * Loads a specific meal for a given user
 */
exports.load_meal = async (req, res) => {
  console.log('looking for meal to load...'); // DEBUG

  const query = { username: req.query.username };
  const projection = {
    username: req.query.username,
    meals: { $elemMatch: { meal_name: req.query.mealName } },
  };

  await Meal.findOne(query, projection)
    .exec()
    .then((doc) => {
      if (doc.length === 0) {
        res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
        console.log(`Meal not found for user ${req.query.username}`); // DEBUG
      } else {
        res.status(200).json(doc);
        console.log(`Meal found for user ${req.query.username}:\n${doc}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/**
 * Creates the first meal of a user
 * @param {*} req request received
 * @param {*} res response to send
 */
const createFirstMeal = (req, res) => {
  const newMeal = new Meal(req.body);
  newMeal.save((err, meal) => {
    if (err) {
      console.log('Error while creating new meal'); // DEBUG
      res.send(err);
    }
    console.log(`Meal created${meal}`); // DEBUG
    res.status(201).json(meal);
  });
};

/**
 * Adds meals to a user's meals list
 * @param {*} req request received
 * @param {*} doc document of the user
 * @param {*} res response to send
 */
const addMeal = (req, doc, res) => {
  // TODO: GESTIONE RES, CONTROLLO SE ESISTE GIà UN update_meal
  //  CON LO STESSO NOME (OPPURE usare un id per evitarlo)
  const mealToAdd = req.body.meals;

  const updateMeal = new Meal(doc);
  updateMeal.meals.push(mealToAdd);

  updateMeal.save((err, meal) => {
    if (err) {
      console.log('error while updating new meal'); // DEBUG
      res.send(err);
    }
    console.log(`meal updated -> ${meal}`); // DEBUG
    res.status(201).json(meal);
  });
};

/**
 * Inserts a new meal for a given user
 */
exports.new_meal = async (req, res) => {
  const query = { username: req.body.username };

  await Meal.findOne(query)
    .exec()
    .then((doc) => {
      if (doc == null) {
        createFirstMeal(req, res);
        console.log(`Meal not found for user ${req.query.username}\n Inserting...`); // DEBUG
      } else {
        addMeal(req, doc, res);
        console.log(`Meal found for user ${req.query.username}:\n${doc}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/**
 * Given a value for 100 grams, computes value for a given quantity.
 * @param {*} value for 100g of the product
 * @param {*} quantity portion of the product in grams
 */
const valuePerPortion = (value, quantity) => ((value / 100) * quantity);


/**
 * Computes meal's values given its components
 * @param {*} barcodes of the products that compose the meal
 * @param {*} quantities in grams of the products eaten
 * @param {*} res
 */
const computeValues = async (barcodes, quantities, res) => {
  let energyTot;
  let quantity;
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
  let i;

  const query = { code: { $in: barcodes } };

  await Products.find(query)
    .exec()
    .then((docs) => {
      energyTot = 0;
      quantity = 0;
      carbsTot = 0;
      sugarsTot = 0;
      fatTot = 0;
      saturatedFatTot = 0;
      proteinsTot = 0;
      fiberTot = 0;
      saltTot = 0;
      sodiumTot = 0;
      alcoholTot = 0;
      calciumTot = 0;
      carbonFootprintTot = 0;
      waterFootprintTot = 0;
      i = 0;

      // console.log(`documents found: ${docs}`); // DEBUG

      docs.forEach((d) => {
        quantity = quantities[i];

        energyTot += valuePerPortion(d.energy_100g, quantity);
        carbsTot += valuePerPortion(d.carbohydrates_100g, quantity);
        sugarsTot += valuePerPortion(d.sugars_100g, quantity);
        fatTot += valuePerPortion(d.fat_100g, quantity);
        saturatedFatTot += valuePerPortion(d.saturated_fat_100g, quantity);
        proteinsTot += valuePerPortion(d.proteins_100g, quantity);
        fiberTot += valuePerPortion(d.fiber_100g, quantity);
        saltTot += valuePerPortion(d.salt_100g, quantity);
        sodiumTot += valuePerPortion(d.sodium_100g, quantity);
        alcoholTot += valuePerPortion(d.alcohol_100g, quantity);
        calciumTot += valuePerPortion(d.calcium_100g, quantity);
        carbonFootprintTot += valuePerPortion(d.carbon_footprint_100g, quantity);
        waterFootprintTot += valuePerPortion(d.water_footprint_100g, quantity);

        i += 1;
      });
    })
    .catch((err) => res.send(err));

  const values = {
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
  // console.log(values); //DEBUG

  return values;
};

/**
 * Update meals total values
 * @param {*} req
 * @param {*} energyTot
 */

const updateValues = async (barcodes, quantities, req, doc, res) => {
  computeValues(barcodes, quantities, res)
    .then((values) => {
      doc.meals.forEach((d) => {
        if (d.meal_name === req.body.mealName) {
          console.log(`-----d.meal_name${d.meal_name}+${values.energy_tot}`); // DEBUG

          d.energy_tot = values.energy_tot;
          d.carbohidrates_tot = values.carbohidrates_tot;
          d.sugars_tot = values.sugars_tot;
          d.fat_tot = values.fat_tot;
          d.saturated_fat_tot = values.saturated_fat_tot;
          d.proteins_tot = values.proteins_tot;
          d.salt_tot = values.salt_tot;
          d.sodium_tot = values.sodium_tot;
          d.calcium_tot = values.calcium_tot;
          d.alcohol_tot = values.alcohol_tot;
          d.fiber_tot = values.fiber_tot;
          d.carbon_footprint_tot = values.carbon_footprint_tot;
          d.water_footprint_tot = values.water_footprint_tot;

          console.log(`d.energy_tot${d.energy_tot}`); // DEBUG
        }
      });
      doc.save((err) => { if (err) res.send(err); });
    });
};


/**
 * Creates a component for an existing meal
 */
exports.new_component = async (req, res) => {
  const query = { username: req.body.username };

  await Meal.find(query)
    .exec()
    .then((doc) => {
      if (doc == null) {
        res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
      } else {
        const barcodes = [];
        const quantities = [];
        console.log(`doc${doc}`); // DEBUG
        doc[0].meals.forEach((d) => {
          if (d.meal_name === req.body.mealName) {
            d.components.push(req.body.components);

            d.components.forEach((c) => {
              barcodes.push(c.barcode);
              quantities.push(c.quantity);
            });
          }
        });
        // doc[0].save((err) => { if (err) res.send(err); });
        // res.status(201).json(doc);
        console.log(`barcodes ${barcodes}\n quantities ${quantities}`); // DEBUG
        updateValues(barcodes, quantities, req, doc[0], res);
      }
    })
    .catch((err) => res.send(err));
};
