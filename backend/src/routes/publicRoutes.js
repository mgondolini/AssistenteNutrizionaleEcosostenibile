const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

module.exports = function publicRoutes(app) {
  // Only routes which don't need token auth
  app.route('/api/auth')
    .post(authController.auth);

  app.route('/api/checkUser/:username')
    .get(userController.checkUser);

  app.route('/api/checkEmail/:email')
    .get(userController.checkEmail);

  app.route('/api/user')
    .post(userController.createNewUser);

  app.route('/api/checkToken')
    .get(authController.checkToken);
};
