const mongoose = require('mongoose');

const User = mongoose.model('User');

/** Inserts a new user if not found in the database */
exports.insert_user = async (req, res) => {
  const query = { username: req.body.username };
  await User.findOne(query)
    .exec()
    .then((user) => {
      if (user == null) {
        console.log('Creating new user...'); // DEBUG
        this.create_new_user(req, res);
      } else {
        res.status(404).json({ description: 'Username already in use!' });
      }
    })
    .catch((err) => res.send(err));
};

/** Creates a new user */
exports.create_new_user = async (req, res) => {
  const newUser = new User(req.body);
  newUser.save()
    .then((user) => {
      console.log(`User crated ->${user}`); // DEBUG
      res.status(201).json(user);
    })
    .catch((err) => res.send(err));
};


/** Loads a user by username */
exports.load_user = async (req, res) => {
  console.log(`looking for user: ${req.query.username}`); // DEBUG
  const query = { username: req.query.username };

  await User.findOne(query)
    .exec()
    .then((user) => {
      if (user == null) {
        res.status(404).send({ description: 'User not found' });
        console.log('User not found'); // DEBUG
      } else {
        res.status(200).json(user);
        console.log(`Found user ->${user.username}`); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};


/** Updates a user */
exports.update_user = async (req, res) => {
  const query = { username: req.params.username };
  const update = req.body; // passare il json utente con tutti i campi (aggiornati e non)

  await User.findOneAndUpdate(query, update, { new: true })
    .exec()
    .then((user) => {
      if (user == null) {
        res.status(404).send({ description: 'User not found' });
        console.log('User not found'); // DEBUG
      } else {
        res.json(user);
        console.log('user updated'); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};


/** Deletes a user given its username */
exports.delete_user = async (req, res) => {
  console.log(`Deleting user: ${req.query.username}`); // DEBUG
  const query = { username: req.query.username };

  await User.deleteOne(query)
    .exec()
    .then((user) => {
      if (user == null) {
        res.status(404).send({ description: 'User not found' });
        console.log('user not found'); // DEBUG
      } else {
        res.json({ message: 'User successfully deleted' });
        console.log('User deleted'); // DEBUG
      }
    })
    .catch((err) => res.send(err));
};
