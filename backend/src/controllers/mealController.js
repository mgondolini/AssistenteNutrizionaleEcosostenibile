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
function createFirstMeal(req, res) {
  const newMeal = new Meal(req.body);
  newMeal.save((err, meal) => {
    if (err) {
      console.log('Error while creating new meal'); // DEBUG
      res.send(err);
    }
    console.log(`Meal created${meal}`); // DEBUG
    res.status(201).json(meal);
  });
}

/**
 * Adds meals to a user's meals list
 * @param {*} req request received
 * @param {*} doc document of the user
 * @param {*} res response to send
 */
function addMeal(req, doc, res) {
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
}

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


// per ogni barcode del pasto cerco il prodotto, sommo i valori dei documenti nei campi del pasto
async function computeValues(barcodes, quantities, res) {
  let energyTot = 0;
  let quantity = 0;
  let i = 0;

  const query = { code: { $in: barcodes } };

  await Products.find(query)
    .exec()
    .then((docs) => {
      console.log(`documents found: ${docs}`); // DEBUG
      docs.forEach((d) => {
        quantity = quantities[i];
        console.log(`prodotto: ${d.product_name} - quantità ${quantity}`); // DEBUG
        energyTot += ((d.energy_100g / 100) * quantity); // dividere per la quantità
        i += 1;
      });
      console.log(`energy_tot ${energyTot}`); // DEBUG
    })
    .catch((err) => res.send(err));
}


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
        console.log(`doc${doc}`);
        doc[0].meals.forEach((d) => {
          if (d.meal_name === req.body.mealName) {
            d.components.push(req.body.components);

            d.components.forEach((c) => {
              barcodes.push(c.barcode);
              quantities.push(c.quantity);
            });
          }
        });
        doc[0].save((err) => { if (err) res.send(err); });
        // res.status(201).json(doc);
        console.log(`barcodes ${barcodes}\n quantities ${quantities}`); // DEBUG
        computeValues(barcodes, quantities, res);
      }
    })
    .catch((err) => res.send(err));
  // TODO: update e calcolo delle calorie tot e degli
  // altri valori totali
};
