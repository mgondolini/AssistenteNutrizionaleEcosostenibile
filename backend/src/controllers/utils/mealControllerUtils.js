/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const productControllerUtils = require('./productControllerUtils.js');

const SingleMeal = mongoose.model('SingleMeal');
const Meals = mongoose.model('Meals');


/** Inits meal values to 0 */
exports.initMealValues = (mealName, timestamp) => {
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
  meal.is_closed = false;
  return meal;
};


/** Add meal to meals array of a user */
exports.addMeal = (req, userMeals, res) => {
  let mealToAdd;
  let exists = false;
  const { mealName } = req.body.meals;
  const { timestamp } = req.body.meals;
  const updateMeal = new Meals(userMeals);

  // controllo se ci sono pasti per lo stesso utente con lo stesso nome che voglio inserire
  userMeals.meals.forEach((m) => {
    if (m.timestamp.getUTCDate() === new Date(timestamp).getUTCDate()
      && m.timestamp.getUTCMonth() === new Date(timestamp).getUTCMonth()
      && m.timestamp.getUTCFullYear() === new Date(timestamp).getUTCFullYear()) {
      if (m.meal_name === mealName) {
        exists = true;
      }
    }
  });

  // se non ci sono pasti con lo stesso nome inizializzo il pasto da inserire
  if (exists === false) {
    mealToAdd = this.initMealValues(mealName, timestamp);
    global.log(`Meal to add ${mealToAdd}`); // DEBUG
  }

  // se mealToAdd è nullo vuol dire che c'era già un pasto con il nome inserito
  // quindi invio un messaggio di errore 400 BAD REQUEST
  if (mealToAdd != null) {
    updateMeal.meals.push(mealToAdd);
    updateMeal.save()
      .then((meal) => {
        global.log(`Meal added -> ${meal}`); // DEBUG
        res.status(200).send(meal);
      })
      .catch((err) => {
        global.log(`Error while adding new meal${err}`); // DEBUG
        res.status(500).send({ description: 'internal_server_error' });
      });
  } else {
    res.status(400).send({ description: 'meal_name_exists' });
  }
};

exports.updateMeal = async (userMeals, mealUpdated, res) => {
  let updated = false;
  const mealName = mealUpdated.meal_name;
  const { timestamp } = mealUpdated;
  console.log(mealName);
  console.log(timestamp);


  userMeals.meals.forEach((m, i) => {
    if (m.timestamp.getUTCDate() === new Date(timestamp).getUTCDate()
      && m.timestamp.getUTCMonth() === new Date(timestamp).getUTCMonth()
      && m.timestamp.getUTCFullYear() === new Date(timestamp).getUTCFullYear()) {
      if (m.meal_name === mealName) {
        userMeals.meals[i] = mealUpdated;
        updated = true;
      }
    }
  });

  if (updated) {
    userMeals.save()
      .then((meal) => {
        global.log(`Meal updated -> ${meal}`); // DEBUG
        res.status(200).send(meal);
      })
      .catch((err) => {
        global.log(`Error while updating meal${err}`); // DEBUG
        res.status(500).send({ description: 'internal_server_error' });
      });
  } else {
    res.status(500).send({ description: 'internal_server_error' });
  }
};

/** Init and add a new component with computed parameters */
exports.addComponent = (components, values, meal) => {
  components.product_name = values.product_name;
  components.energy_per_quantity = values.energy_tot;
  components.image_url = values.image_url;
  components.carbon_footprint = values.carbon_footprint_tot;
  components.water_footprint = values.water_footprint_tot;
  components.nutrition_score = values.nutrition_score;

  // Add passed components to meal's components array
  meal.components.push(components);
};


/** Update meal values after inserting a new component */
exports.updateMealValues = async (components, timestamp, mealName, userMeals, res) => {
  const { barcode } = components;
  const { quantity } = components;
  let exists = false;

  // Quando aggiungo un nuovo componente devo aggiornare tutti i valori totali del pasto
  // (energia, carboidrati, ecc)
  // Prima di tutto vado a calcolare i valori del prodotto corrispondenti
  // alla quantità in grammi che ho inserito,
  // poi incremento i valori del pasto aggiungendo il risultato ottenuto

  productControllerUtils.computeProductValues(barcode, quantity, res)
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
            if (meal.components.length > 0) {
              meal.components.forEach((component) => {
                if (component.barcode === barcode) {
                  component.quantity += quantity;
                  component.energy_per_quantity += values.energy_tot;
                  component.carbon_footprint += values.carbon_footprint_tot;
                  component.water_footprint += values.water_footprint_tot;
                  exists = true;
                }
              });
            }

            if (!exists) this.addComponent(components, values, meal);

            updated = true;
          }
        }
      });
      if (updated) {
        // salvo il pasto
        userMeals.save()
          .then((meals) => {
            global.log(`Meal updated \n${userMeals}`); // DEBUG
            res.status(200).send(meals);
          })
          .catch((err) => {
            global.log(`Error while updating meal: ${err}`); // DEBUG
            res.status(500).send({ description: 'internal_server_error' });
          });
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

  if (updated) {
    userMeals.save()
      .then((meals) => res.status(200).send(meals))
      .catch((err) => {
        global.log(`Error while deleting component: ${err}`);
        res.status(500).send({ description: 'internal_server_error' });
      });
  } else {
    // Se non ho trovato il pasto mando un messaggio di errore
    res.status(400).send({ description: 'meal_not_found' });
  }
};
