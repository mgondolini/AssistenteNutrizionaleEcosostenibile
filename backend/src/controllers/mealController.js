/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const authController = require('./authController');
const mealControllerUtils = require('./utils/mealControllerUtils.js');
const achievementController = require('./achievementController.js');

const Meals = mongoose.model('Meals');

/** Creates user document inside Meals collection */
exports.initUserMeals = async (username, res) => {
  const userMeals = new Meals();
  userMeals.username = username;
  userMeals.meals = [];
  userMeals.save()
    .then((userMeal) => {
      global.log(`userMeals created -> ${userMeal}`); // DEBUG
      res.status(200).send(userMeal);
    })
    .catch((err) => {
      global.log(`Error while creating userMeals ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};


/** Deletes user document inside Meals collection */
exports.deleteUserMeals = async (username, res) => {
  const query = { username };
  Meals.remove(query)
    .then((removed) => {
      global.log(`User Meal document removed for user ${username}:\n${JSON.stringify(removed)}`); // DEBUG
      res.status(200).send({ message: 'user_meal_removed' });
    })
    .catch((err) => {
      global.log(`Error while creating userMeals ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};


/** Loads all the meals for a given user */
exports.load_meals_list = async (req, res) => {
  global.log('looking for meal...'); // DEBUG
  const username = authController.getUsername(req.headers.token);
  const query = { username };
  global.log(query);

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals === null) {
        res.status(400).send({ description: 'mealslist_not_found' });
        global.log(`Meals not found for user ${username}`); // DEBUG
      } else {
        res.status(200).send(userMeals);
        global.log(`Meals list for user ${username}:\n${userMeals}`); // DEBUG
      }
    })
    .catch((err) => {
      global.log(`Error while loading meals list: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};


/** Loads a specific meal for a given user */
exports.load_meal = async (req, res) => {
  global.log('looking for meal to load...'); // DEBUG
  const username = authController.getUsername(req.headers.token);
  global.log(username);

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
        global.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        res.status(200).send(meal);
        global.log(`Meal found for user ${username}:\n${meal}`); // DEBUG
      }
    })
    .catch((err) => {
      global.log(`Error while loading meal ${err}`);
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Inserts a new meal for a given user */
exports.new_meal = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const query = { username };

  global.log(`date----- ${req.body.meals.timestamp}`); // DEBUG

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals === null) {
        res.status(500).send({ description: 'internal_server_error' });
        global.log(`Meal not found for user ${username}\n`); // DEBUG
      } else {
        global.log(`Meal found for user ${username}:\n${userMeals}`); // DEBUG
        mealControllerUtils.addMeal(req, userMeals, res);
      }
    })
    .catch((err) => {
      global.log(`Error while creating new meal: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Updates a meal with a given property */
exports.update_meal = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const mealUpdated = req.body;
  const query = { username };
  console.log(mealUpdated);

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals === null) {
        res.status(500).send({ description: 'internal_server_error' });
        global.log(`UserMeals not found for user ${username}\n`); // DEBUG
      } else {
        global.log(`Meal found for user ${username}:\n${userMeals}`); // DEBUG
        mealControllerUtils.updateMeal(userMeals, mealUpdated, res);
      }
    })
    .catch((err) => {
      global.log(`Error while updating meal: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Deletes a meal */
exports.delete_meal = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.query;
  const { date } = req.query;

  global.log(`date----- ${date}`); // DEBUG

  const query = { username };
  const update = {
    $pull: {
      meals: {
        meal_name: mealName,
        timestamp: date,
      },
    },
  };

  global.log(`UPDATE QUERY -> ${JSON.stringify(update)}`); // DEBUG

  await Meals.findOne(query)
    .exec()
    .then((uMeal) => {
      const first = uMeal.meals.length === 1;
      const myDate = new Date(date);
      uMeal.meals.forEach((m) => {
        if ((m.meal_name === mealName)
          && (m.timestamp.getUTCDate() === myDate.getUTCDate())
          && (m.timestamp.getUTCMonth() === myDate.getUTCMonth())
          && (m.timestamp.getUTCFullYear() === myDate.getUTCFullYear())) {
          if (m.is_closed) {
            achievementController.deleteAchievements(m, username, first);
          }
        }
      });
    })
    .catch((err) => {
      global.log(err);
    });

  await Meals.updateOne(query, update)
    .exec()
    .then((meal) => {
      if (meal.length === 0) {
        res.status(400).send({ description: 'meal_not_found' });
        global.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        global.log(`Meal updated for user ${username}:\n${JSON.stringify(meal)}`); // DEBUG
        res.status(200).send(meal);
      }
    })
    .catch((err) => {
      global.log(`Error while deleting meal: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Creates a component for an existing meal */
exports.new_component = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.body;
  const { timestamp } = req.body;
  const { components } = req.body;

  const query = { username };
  global.log(`NEW COMPONENT\nmealName${JSON.stringify(mealName)}\ncomponents${JSON.stringify(components)}`); // DEBUG

  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals == null) res.status(404).send({ description: 'meal_not_found' });
      else mealControllerUtils.updateMealValues(components, timestamp, mealName, userMeals, res);
    })
    .catch((err) => {
      global.log(`Error while creating component ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/** Deletes a component in a meal given the barcode */
exports.delete_component = async (req, res) => {
  const username = authController.getUsername(req.headers.token);
  const { mealName } = req.query;
  const { date } = req.query;
  const { barcode } = req.query;
  const { quantity } = req.query;

  const query = { username };

  // Controllo se esistono pasti per l'utente
  await Meals.findOne(query)
    .exec()
    .then((userMeals) => {
      if (userMeals.length === 0) {
        res.status(400).send({ description: 'meal_not_found' });
        global.log(`Meal not found for user ${username}`); // DEBUG
      } else {
        // Se esistono pasti chiamo questa funzione che: cerca il pasto corrispondente al nome dato,
        // cerca il componente e lo elimina
        mealControllerUtils.pullComponent(userMeals, date, mealName, barcode, quantity, res);
      }
    })
    .catch((err) => {
      global.log(`Error while deleting component: ${err}`);
      res.status(500).send({ description: 'internal_server_error' });
    });
};
