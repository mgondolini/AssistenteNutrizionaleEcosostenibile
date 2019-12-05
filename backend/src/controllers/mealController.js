/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const mealControllerUtils = require('./utils/mealControllerUtils.js');

const Meals = mongoose.model('Meals');

/**
 * Loads all the meals for a given user
 */
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

/**
 * Inserts a new meal for a given user
 */
exports.new_meal = async (req, res) => {
  const query = { username: req.body.username };

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) {
        mealControllerUtils.createFirstMeal(req, res);
        console.log(`Meal not found for user ${req.query.username}\n Inserting...`); // DEBUG
      } else {
        mealControllerUtils.addMeal(req, userMeals, res);
        console.log(`Meal found for user ${req.query.username}:\n${userMeals}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};

exports.delete_meal = async (req, res) => {

};

/**
 * Creates a component for an existing meal
 */
exports.new_component = async (req, res) => {
  const query = { username: req.body.username };
  const { mealName } = req.body;
  const { components } = req.body;
  console.log(`NEW COMPONENT\nmealName${JSON.stringify(mealName)}\ncomponents${JSON.stringify(components)}`); // DEBUG

  await Meals.find(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) res.status(404).send({ description: `Meal not found for user ${req.query.username}` });
      else mealControllerUtils.updateMealValues(components, mealName, userMeals[0], res);
    })
    .catch((err) => res.send(err));
};

exports.delete_component = async (req, res) => {

};
