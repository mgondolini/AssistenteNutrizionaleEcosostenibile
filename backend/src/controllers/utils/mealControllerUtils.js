/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const SingleMeal = mongoose.model('SingleMeal');
const Meals = mongoose.model('Meals');
const Products = mongoose.model('Product');


/** Inits meal values to 0 */
exports.initMealValues = (mealName, timestamp) => {
  console.log('init meal values');
  const meal = new SingleMeal(); // SingleMeal compone l'array meals di UserMealSchema
  meal.meal_name = mealName;
  meal.components = [];
  meal.energy_tot = 0;
  meal.carbohydrates_tot = 0;
  meal.sugars_tot = 0;
  meal.fat_tot = 0;
  meal.saturated_fat_tot = 0;
  meal.proteins_tot = 0;
  meal.fiber_tot = 0;
  meal.salt_tot = 0;
  meal.sodium_tot = 0;
  meal.alcohol_tot = 0;
  meal.calcium_tot = 0;
  meal.carbon_footprint_tot = 0;
  meal.water_footprint_tot = 0;
  meal.timestamp = timestamp;
  return meal;
};


/** Add meal to meals array of a user */
exports.addMeal = (req, userMeals, res) => {
  let mealToAdd;
  let exists = false;
  const { mealName } = req.body.meals;
  const { timestamp } = req.body.meals;
  const updateMeal = new Meals(userMeals);

  console.log(`timestamp${timestamp}`); // DEBUG

  // controllo se ci sono pasti per lo stesso utente con lo stesso nome che voglio inserire
  userMeals.meals.forEach((m) => {
    console.log(1);
    console.log(`${m.timestamp.getUTCDate()}-${new Date(timestamp).getUTCDate()}`);

    if (m.timestamp.getUTCDate() === new Date(timestamp).getUTCDate()
      && m.timestamp.getUTCMonth() === new Date(timestamp).getUTCMonth()
      && m.timestamp.getUTCFullYear() === new Date(timestamp).getUTCFullYear()) {
      console.log('2');
      if (m.meal_name === mealName) {
        console.log('3');
        exists = true;
      }
    }
  });

  // se non ci sono pasti con lo stesso nome inizializzo il pasto da inserire
  if (exists === false) {
    mealToAdd = this.initMealValues(mealName, timestamp);
    console.log(`Meal to add ${mealToAdd}`); // DEBUG
  }

  // se mealToAdd è nullo vuol dire che c'era già un pasto con il nome inserito
  // quindi invio un messaggio di errore 400 BAD REQUEST
  if (mealToAdd != null) {
    updateMeal.meals.push(mealToAdd);
    updateMeal.save()
      .then((meal) => {
        console.log(`meal updated -> ${meal}`); // DEBUG
        res.status(200).json(meal);
      })
      .catch((err) => {
        console.log(`error while updating new meal${err}`); // DEBUG
        res.status(500).send({ description: 'internal_server_error' });
      });
  } else {
    res.status(400).send({ description: 'meal_name_exists' });
  }
};


/** Creates the first meal of a user */
exports.createFirstMeal = (username, req, res) => {
  const { mealName } = req.body.meals;
  const { timestamp } = req.body.meals;

  const newMeal = new Meals();
  newMeal.username = username;

  console.log(`create first meal${timestamp}`);

  // Inizializzo i campi e lo aggiungo all'array dei pasti
  const mealToAdd = this.initMealValues(mealName, timestamp);
  newMeal.meals.push(mealToAdd);

  newMeal.save()
    .then((meal) => {
      console.log(`meal created -> ${meal}`); // DEBUG
      res.status(201).json(meal);
    })
    .catch((err) => {
      console.log('error while creating new meal'); // DEBUG
      res.status(500).send(err);
    });
};


/** Computes value in grams for a portion of a given quantity */
exports.computeValuePerPortion = (value, quantity) => ((value / 100) * quantity);


/** Checks the value before compute the expression */
exports.valuePerPortion = (value, quantity) => {
  let valuePerQuantity;

  if (value != null) valuePerQuantity = this.computeValuePerPortion(value, quantity);
  else valuePerQuantity = 0;

  return valuePerQuantity;
};


/** Computes values for a meal */
exports.computeMealValues = async (barcode, quantity, res) => {
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
  console.log(`VALUES -> ${JSON.stringify(values)}`); // DEBUG

  return values;
};


/** Update meal values after inserting a new component */
exports.updateMealValues = async (components, timestamp, mealName, userMeals, res) => {
  const { barcode } = components;
  const { quantity } = components;

  // Quando aggiungo un nuovo componente devo aggiornare tutti i valori totali del pasto
  // (energia, carboidrati, ecc)
  // Prima di tutto vado a calcolare i valori del prodotto corrispondenti
  // alla quantità in grammi che ho inserito,
  // poi incremento i valori del pasto aggiungendo il risultato ottenuto

  this.computeMealValues(barcode, quantity, res)
    .then((values) => {
      let updated = false;

      userMeals.meals.forEach((meal) => {
        if (meal.timestamp.getUTCDate() === new Date(timestamp).getUTCDate()
          && meal.timestamp.getUTCMonth() === new Date(timestamp).getUTCMonth()
          && meal.timestamp.getUTCFullYear() === new Date(timestamp).getUTCFullYear()) {
          if (meal.meal_name === mealName) {
          // Meal schema field update -> increment values by the found product values
            meal.energy_tot += values.energy_tot;
            meal.carbohidrates_tot += values.carbohidrates_tot;
            meal.sugars_tot += values.sugars_tot;
            meal.fat_tot += values.fat_tot;
            meal.saturated_fat_tot += values.saturated_fat_tot;
            meal.proteins_tot += values.proteins_tot;
            meal.salt_tot += values.salt_tot;
            meal.sodium_tot += values.sodium_tot;
            meal.calcium_tot += values.calcium_tot;
            meal.alcohol_tot += values.alcohol_tot;
            meal.fiber_tot += values.fiber_tot;
            meal.carbon_footprint_tot += values.carbon_footprint_tot;
            meal.water_footprint_tot += values.water_footprint_tot;

            // Quando inserisco un componente questi due campi vengono passati vuoti
            // quindi li riempio ora con i valori del prodotto trovati

            // Components schema field update
            components.product_name = values.product_name;
            components.image_url = values.image_url;
            components.carbon_footprint = 0;
            components.water_footprint = 0;

            console.log(`components: ${components}`); // DEBUG

            // Add passed components to meal's components array
            meal.components.push(components);
            updated = true;
          }
        }
      });
      if (updated === true) {
        // salvo il pasto
        userMeals.save()
          .then((meals) => res.status(200).json(meals))
          .catch((err) => res.status(500).send(err));
      } else {
        // Se non ho trovato il pasto mando un messaggio di errore
        res.status(400).send({ description: 'meal_not_found' });
      }
    });
};

/** Pulls a component from components array of a meal */
exports.pullComponent = async (userMeals, timestamp, mealName, barcode, res) => {
  // Controllo se esiste un pasto con il nome passato
  // e tolgo il componente corrispondente la barcode
  let updated = false;
  userMeals.meals.forEach((meal) => {
    if (meal.timestamp.getUTCDate() === new Date(timestamp).getUTCDate()
      && meal.timestamp.getUTCMonth() === new Date(timestamp).getUTCMonth()
      && meal.timestamp.getUTCFullYear() === new Date(timestamp).getUTCFullYear()) {
      if (meal.meal_name === mealName) {
        meal.components.forEach((component) => {
          // eslint-disable-next-line eqeqeq
          if (component.barcode == barcode) {
            meal.components = meal.components.pull(component);
            updated = true;
          }
        });
      }
    }
  });

  if (updated === true) {
    userMeals.save()
      .then((meals) => res.status(200).json(meals))
      .catch((err) => res.status(500).send(err));
  } else {
    // Se non ho trovato il pasto mando un messaggio di errore
    res.status(400).send({ description: 'meal_not_found' });
  }
};
