const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const mealController = require('../controllers/mealController');
const keyController = require('../controllers/keyController');

module.exports = function (app) {
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

  app.route('/api/meals/')
    .get(mealController.load_meals_list)
    .post(mealController.new_meal);

  app.route('/api/meals/:mealName')
    .get(mealController.load_meal)
    .delete(mealController.delete_meal);

  app.route('/api/meals/:mealName/components')
    .put(mealController.new_component)
    .delete(mealController.delete_component);
};
