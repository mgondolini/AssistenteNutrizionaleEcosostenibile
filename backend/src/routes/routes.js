const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const mealController = require('../controllers/mealController');
const keyController = require('../controllers/keyController');

module.exports = function (app) {
  app.use('/api/*', (req, res, next) => {
    try {
      // check token validity
      jwt.verify(req.headers.token, config.tokenKey);
      // valid token
      next();
    } catch (err) {
      // invavild token
      res.status(401).send('Invalid token: '.concat(err));
    }
  });

  app.route('/api/publickey')
    .get(keyController.getPublicKey);

  app.route('/api/user')
    .get(userController.load_user)
    .put(userController.update_user);

  app.route('/api/user/:username')
    .delete(userController.delete_user);

  app.route('/api/product')
    .get(productController.load_product)
    .post(productController.insert_product);

  app.route('/api/meals/:date')
    .get(mealController.load_meals_list)
    .post(mealController.new_meal);

  app.route('/api/meals/:mealName/:date')
    .delete(mealController.delete_meal)
    .put(mealController.update_meal);

  app.route('/api/meal')
    .get(mealController.load_meal);

  app.route('/api/meals/:mealName/:date/components')
    .put(mealController.new_component)
    .delete(mealController.delete_component);
};
