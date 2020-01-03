/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
// const authController = require('../controllers/authController');
const mealControllerUtils = require('./utils/mealControllerUtils.js');

const Meals = mongoose.model('Meals');

/** Loads all the meals for a given user */
exports.load_meals_list = async (req, res) => {
  console.log('looking for meal...'); // DEBUG

  const { query } = req;

  await Meals.findOne(query)
    .exec()
    .then((meals) => {
      if (meals.length === 0) {
        res.status(404).send({ description: `Meals not found for user ${req.query.username}` });
        console.log(`Meals not found for user ${req.query.username}`); // DEBUG
      } else {
        res.status(200).json(meals);
        console.log(`Meals list for user ${req.query.username}:\n${meals}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/** Loads a specific meal for a given user */
exports.load_meal = async (req, res) => {
  console.log('looking for meal to load...'); // DEBUG

  // Lato client passare la data del pasto in formato UTC

  const query = { username: req.query.username };
  const projection = {
    username: req.query.username,
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
        res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
        console.log(`Meal not found for user ${req.query.username}`); // DEBUG
      } else {
        res.status(200).json(meal);
        console.log(`Meal found for user ${req.query.username}:\n${meal}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

/** Inserts a new meal for a given user */
exports.new_meal = async (req, res) => {
  const query = { username: req.body.username };

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) {
        mealControllerUtils.createFirstMeal(req, res);
        console.log(`Meal not found for user ${req.body.username}\n Inserting...`); // DEBUG
      } else {
        console.log(`Meal found for user ${req.body.username}:\n${userMeals}`); // DEBUG
        mealControllerUtils.addMeal(req, userMeals, res);
      }
    })
    .catch((err) => res.send(err));
};

/** Deletes a meal */
exports.delete_meal = async (req, res) => {
  const { mealName } = req.query;
  const { date } = req.query;
  const { username } = req.query;

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
        res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
        console.log(`Meal not found for user ${req.query.username}`); // DEBUG
      } else {
        console.log(`Meal updated for user ${req.query.username}:\n${JSON.stringify(meal)}`); // DEBUG
        res.status(200).json(meal);
      }
    })
    .catch((err) => res.send(err));
};

/** Creates a component for an existing meal */
exports.new_component = async (req, res) => {
  const { username } = req.body;
  const { mealName } = req.body;
  const { timestamp } = req.body;
  const { components } = req.body;

  const query = { username };
  console.log(`NEW COMPONENT\nmealName${JSON.stringify(mealName)}\ncomponents${JSON.stringify(components)}`); // DEBUG

  await Meals.find(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
      else mealControllerUtils.updateMealValues(components, timestamp, mealName, userMeals[0], res);
    })
    .catch((err) => res.send(err));
};

/** Deletes a component in a meal given the barcode */
exports.delete_component = async (req, res) => {
  const { username } = req.query;
  const { mealName } = req.query;
  const { barcode } = req.query;
  const query = { username };

  // Controllo se esistono pasti per l'utente
  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals.length === 0) {
        res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
        console.log(`Meal not found for user ${req.query.username}`); // DEBUG
      } else {
        console.log(`Meal updated for user ${req.query.username}:\n${userMeals}`); // DEBUG
        // Se esistono pasti chiamo questa funzione che: cerca il pasto corrispondente al nome dato,
        // cerca il componente e lo elimina
        mealControllerUtils.pullComponent(userMeals, mealName, barcode, res);
      }
    })
    .catch((err) => res.send(err));
};
