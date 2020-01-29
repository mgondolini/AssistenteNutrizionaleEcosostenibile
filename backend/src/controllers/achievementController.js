const mongoose = require('mongoose');
const auth = require('./authController');

const User = mongoose.model('User');

const carbonMax = 100;
const waterMax = 100;

/* get user's achievements */
exports.getAchievements = function getAchievements(req, res) {
  const username = auth.getUsername(req.headers.token);
  User.findOne({ username })
    .exec()
    .then((user) => {
      const ach = user.achievements;
      global.log(`${username} achievements: ${ach}`);
      res.status(200).send({ achievements: ach });
    })
    .catch((err) => {
      global.log(`Error while getting user achievements: ${err}`); // DEBUG
      res.status(500).send({ description: 'internal_server_error' });
    });
};

/* check achievements, maybe this is useless */
exports.checkAchievements = function checkAchievements(username, carbon, water) {
  // const username = auth.getUsername(req.headers.token);
  // firstReg
  // firstMeal
  // greenMeal
  // waterSaverMeal
  // perfMeal
  // tenGreenMeal
  // tenWaterSaverMeal
  // tenPerfMeal
  User.findOne({ username })
    .exec()
    .then((user) => {
      // check achievements
      const ach = user.achievements;
      if (carbon <= carbonMax) {
        //
      }
      global.log(user);
    })
    .catch((err) => {
      // manage errors
      global.log(err);
    });
};
