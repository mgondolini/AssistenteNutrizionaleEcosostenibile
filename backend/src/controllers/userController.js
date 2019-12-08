const mongoose = require('mongoose');

const User = mongoose.model('User');

/** Creates a new user */
exports.create_user = (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('Error while creating new user'); // DEBUG
      res.send(err);
    }
    console.log(`User crated ->${user}`); // DEBUG
    res.status(201).json(user);
  });
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
  console.log(`Update user: ${req.body.username}`); // DEBUG

  const query = { username: req.body.username };
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
