const mongoose = require('mongoose');
const auth = require('./authController');

const User = mongoose.model('User');

const carbonThreshold = 100;
const waterThreshold = 100;

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

/* check achievements on meal close */
exports.checkAchievements = function checkAchievements(meal, first, userMeals, res) {
  /*
  const ach = [{ title: 'firstReg', count: 1 },
    { title: 'firstMeal', count: 0 },
    { title: 'greenMeal', count: 0 },
    { title: 'waterSaverMeal', count: 0 },
    { title: 'perfMeal', count: 0 },
    { title: 'tenGreenMeal', count: 0 },
    { title: 'tenWaterSaverMeal', count: 0 },
    { title: 'tenPerfMeal', count: 0 }];
  */
  const carbon = meal.carbon_footprint_tot;
  const water = meal.water_footprint_tot;
  const { username } = userMeals;
  User.findOne({ username })
    .exec()
    .then((user) => {
      // check achievements
      const newAch = user.achievements;
      let cNewAch = 0;
      if (first) {
        newAch[1].count = 1;
        cNewAch += 1;
      }
      if (carbon <= carbonThreshold) {
        newAch[2].count += 1;
        if (newAch[2].count === 1) cNewAch += 1;
        if (newAch[2].count % 10 === 0) {
          newAch[5].count += 1;
          if (newAch[5].count === 1) cNewAch += 1;
        }
      }
      if (water <= waterThreshold) {
        newAch[3].count += 1;
        if (newAch[3].count === 1) cNewAch += 1;
        if (newAch[3].count % 10 === 0) {
          newAch[6].count += 1;
          if (newAch[6].count === 1) cNewAch += 1;
        }
      }
      if (carbon <= carbonThreshold && water <= waterThreshold) {
        newAch[4].count += 1;
        if (newAch[4].count === 1) cNewAch += 1;
        if (newAch[4].count % 10 === 0) {
          newAch[7].count += 1;
          if (newAch[7].count === 1) cNewAch += 1;
        }
      }
      const updateUser = user;
      updateUser.achievements = newAch;
      User.findOneAndUpdate({ username }, updateUser, { new: true })
        .exec()
        .then(() => {
          // Ok
          global.log(`Achievements updated: ${newAch}`);
          res.status(200).send({ userMeals, countNewAch: cNewAch });
        })
        .catch((err) => {
          // Error
          global.log(`Error while updating user achievements ${err}`); // DEBUG
          res.status(500).send({ description: 'internal_server_error' });
        });
    })
    .catch((err) => {
      // Errors
      global.log(`Error while reading user achievements ${err}`);
      res.status(500).send({ description: 'internal_server_error' });
    });
};

exports.deleteAchievements = async (meal, username, first) => {
  const carbon = meal.carbon_footprint_tot;
  const water = meal.water_footprint_tot;
  await User.findOne({ username })
    .exec()
    .then(async (user) => {
      // check achievements
      const newAch = user.achievements;
      if (first) {
        newAch[1].count = 0;
      }
      if (carbon <= carbonThreshold) {
        if (newAch[2].count > 0) newAch[2].count -= 1;
        if (newAch[2].count % 10 === 9) {
          newAch[5].count -= 1;
        }
      }
      if (water <= waterThreshold) {
        if (newAch[3].count > 0) newAch[3].count -= 1;
        if (newAch[3].count % 10 === 9) {
          newAch[6].count -= 1;
        }
      }
      if (carbon <= carbonThreshold && water <= waterThreshold) {
        if (newAch[4].count > 0) newAch[4].count -= 1;
        if (newAch[4].count % 10 === 9) {
          newAch[7].count -= 1;
        }
      }
      const updateUser = user;
      updateUser.achievements = newAch;
      await User.findOneAndUpdate({ username }, updateUser, { new: true })
        .exec()
        .then()
        .catch();
    })
    .catch();
};
