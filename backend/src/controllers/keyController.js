exports.getPublicKey = function getPublicKey(req, res) {
  global.log(req.body);
  res.status(200);
  /*
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) {
      console.log('error while creating new user'); // DEBUG
      res.send(err);
    }
    console.log(`user crated${user}`); // DEBUG
    res.status(201).json(user);
  });
  */
};
