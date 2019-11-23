module.exports = function(app) {
    var userController = require('../controllers/userController');
    var productController = require('../controllers/productController');
    var mealController = require('../controllers/mealController');

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
    app.route('/api/meals')
        .get(mealController.load_meals_list)
        .post(mealController.new_meal);

    // app.route('/api/meals/:username')
    //     .get(mealController.load_meals_list)
    
    app.route('/api/meals/:name')
        .get(mealController.load_meal) 
        // .put(mealController.update_meal)

};
    
    