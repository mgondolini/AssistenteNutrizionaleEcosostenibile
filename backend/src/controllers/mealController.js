/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const authController = require('./authController');
const mealControllerUtils = require('./utils/mealControllerUtils.js');

const Meals = mongoose.model('Meals');

/** Loads all the meals for a given user */
exports.load_meals_list = async (req, res) => {
  console.log('looking for meal...'); // DEBUG
  const username = authController.getUsername(req.headers.token);
  const query = { username };
  console.log(query);

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      console.log(`userMeals${userMeals}`);
      if (userMeals === null) {
        res.status(400).send({ description: 'mealslist_not_found' });
        console.log(`Meals not found for user ${username}`); // DEBUG
      } else {
        res.status(200).json(userMeals);
        console.log(`Meals list for user ${username}:\n${userMeals}`); // DEBUG
      }
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};


/** Loads a specific meal for a given user */
exports.load_meal = async (req, res) => {
  console.log('looking for meal to load...'); // DEBUG
  const username = authController.getUsername(req.headers.token);
  console.log(username);

  // Lato client passare la data del pasto in formato UTC
  const query = { username };
  const projection = {
    username,
    meals: {
      $elemMatch: {
        meal_name: req.query.mealName,
        timestamp: req.query.date,
      },
    },
  };

  await Meals.findOne(query, projection)
    .exec()
    .then((meal) => {
      if (meal.length === 0) {
        res.status(400).send({ description: 'meal_not_found' });
        console.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        res.status(200).json(meal);
        console.log(`Meal found for user ${username}:\n${meal}`); // DEBUG
      }
    })
    .catch((er) => {
      console.log('errore in load_meal'.concat(er));
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Inserts a new meal for a given user */
exports.new_meal = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const query = { username };

  console.log(`date----- ${req.body.meals.timestamp}`); // DEBUG

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals === null) {
        res.status(500).send({ description: 'internal_server_error' });
        console.log(`Meal not found for user ${username}\n Inserting...`); // DEBUG
      } else {
        console.log(`Meal found for user ${username}:\n${userMeals}`); // DEBUG
        mealControllerUtils.addMeal(req, userMeals, res);
      }
    })
    .catch((err) => res.status(500).send(err));
};

/** Deletes a meal */
exports.delete_meal = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.query;
  const { date } = req.query;

  console.log(`date----- ${date}`); // DEBUG

  const query = { username };
  const update = {
    $pull: {
      meals: {
        meal_name: mealName,
        timestamp: date,
      },
    },
  };

  console.log(`UPDATE QUERY -> ${JSON.stringify(update)}`); // DEBUG

  await Meals.updateOne(query, update)
    .exec()
    .then((meal) => {
      if (meal.length === 0) {
        res.status(400).send({ description: 'meal_not_found' });
        console.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        console.log(`Meal updated for user ${username}:\n${JSON.stringify(meal)}`); // DEBUG
        res.status(200).json(meal);
      }
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};

/** Creates a component for an existing meal */
exports.new_component = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.body;
  const { timestamp } = req.body;
  const { components } = req.body;

  const query = { username };
  console.log(`NEW COMPONENT\nmealName${JSON.stringify(mealName)}\ncomponents${JSON.stringify(components)}`); // DEBUG

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) res.status(404).send({ description: 'meal_not_found' });
      else mealControllerUtils.updateMealValues(components, timestamp, mealName, userMeals, res);
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};

/** Deletes a component in a meal given the barcode */
exports.delete_component = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.query;
  const { date } = req.query;
  const { barcode } = req.query;

  const query = { username };

  // Controllo se esistono pasti per l'utente
  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals.length === 0) {
        res.status(400).send({ description: 'meal_not_found' });
        console.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        console.log(`Meal updated for user ${username}:\n${userMeals}`); // DEBUG
        // Se esistono pasti chiamo questa funzione che: cerca il pasto corrispondente al nome dato,
        // cerca il componente e lo elimina
        mealControllerUtils.pullComponent(userMeals, date, mealName, barcode, res);
      }
    })
    .catch(() => res.status(500).send({ description: 'internal_server_error' }));
};
