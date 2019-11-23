const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const mealController = require('../controllers/mealController');

module.exports = function (app) {
  // app.route('/')
  //     .get(userController.show_index); //mostrare la home

  app.route('/api/user')
    .post(userController.create_user);

  app.route('/api/user/:username')
    .get(userController.load_user)
    .put(userController.update_user)
    .delete(userController.delete_user);

  app.route('/api/product/:barcode')
    .get(productController.load_product);


  // TODO: meals routes da aggiornare eventualmente
  app.route('/api/user/meals')
    .get(mealController.load_meals_list)
    .post(mealController.create_meal);

  app.route('/api/user/meals/:name')
    .get(mealController.load_meal)
    .put(mealController.update_meal);
};
