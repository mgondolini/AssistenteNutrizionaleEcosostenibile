const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const mealController = require('../controllers/mealController');

module.exports = function (app) {
  app.route('/api/user')
    .post(userController.create_user);

  app.route('/api/user/:username')
    .get(userController.load_user)
    .put(userController.update_user)
    .delete(userController.delete_user);

  app.route('/api/product/:barcode')
    .get(productController.load_product);

  app.route('/api/:user/meals/')
    .get(mealController.load_meals_list)
    .post(mealController.new_meal);

  app.route('/api/:user/meals/:mealName')
    .get(mealController.load_meal);

  app.route('/api/:user/meals/:mealName/components')
    .put(mealController.new_component);
};
