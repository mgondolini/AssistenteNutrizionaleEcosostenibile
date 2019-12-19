const authController = require('../controllers/authController');

module.exports = function publicRoutes(app) {
  // Only routes which don't need token auth
  app.route('/api/auth')
    .post(authController.auth);

  app.route('/api/checkToken')
    .get(authController.checkToken);
};
