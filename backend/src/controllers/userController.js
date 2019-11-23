const mongoose = require('mongoose');

const User = mongoose.model('User');

// exports.show_index = function(req, res) {
// res.sendFile(appRoot  + '/www/index.html');
// };

exports.create_user = function (req, res) {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('error while creating new user'); // DEBUG
      res.send(err);
    }
    console.log(`user crated${user}`); // DEBUG
    res.status(201).json(user);
  });
};

exports.load_user = function (req, res) {
  console.log(`looking for user: ${req.params.username}`); // DEBUG
  const query = { username: req.params.username };

  User.findOne(query, (err, user) => {
    if (err) {
      console.log('error while loading user'); // DEBUG
      res.send(err);
    } else if (user == null) {
      res.status(404).send({ description: 'user not found' });
      console.log('user not found'); // DEBUG
    } else {
      res.json(user);
      console.log(`found user ->${user.username}`); // DEBUG
    }
  });
};

exports.update_user = function (req, res) {
  console.log(`update user: ${req.params.username}`);
  const query = { username: req.params.username }; // forse da cambiare, passare nome utente
  const update = req.body; // passare il json utente coi campi aggiornati

  User.findOneAndUpdate(query, update, { new: true }, (err, user) => {
    if (err) {
      res.send(err);
      console.log('error while updating user'); // DEBUG
    } else if (user == null) {
      res.status(404).send({ description: 'User not found' });
      console.log('user not found'); // DEBUG
    } else {
      res.json(user);
      console.log('user updated'); // DEBUG
    }
  });
};

exports.delete_user = function (req, res) {
  console.log(`deleting user: ${req.params.username}`); // DEBUG
  const query = { username: req.params.username };

  User.deleteOne(query, (err, user) => {
    if (err) {
      res.send(err);
      console.log('error while deleting user'); // DEBUG
    } else if (user == null) {
      res.status(404).send({ description: 'User not found' });
      console.log('user not found'); // DEBUG
    } else {
      res.json({ message: 'User successfully deleted' });
      console.log('user deleted'); // DEBUG
    }
  });
};
