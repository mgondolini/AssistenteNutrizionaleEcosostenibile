const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const fs = require('fs');
const config = require('../../config.json');

const UserModel = mongoose.model('User');
const iterations = 420;
const keyLen = 512;
const digest = 'sha512';

exports.auth = function auth(req, res) {
  const query = { email: req.body.email };
  UserModel.findOne(query)
    .exec()
    .then((user) => {
      // User found
      const psw = req.body.key;
      const salt = user.salt.toString();
      const pswHash = crypto.pbkdf2Sync(psw,
        salt,
        iterations,
        keyLen,
        digest).toString();
      if (pswHash === user.password_hash_salt) {
        // Correct password
        res.status(200);

        // TODO REMOVE ME
        if (req.body.email === 'test@test.it') {
          const tok = jwt.sign({
            email: user.email,
          }, config.tokenKey);
          /*
          fs.writeFile('token.txt', tok, (err) => {
            if (err) global.log(err);
            // global.log('Saved publicKey!');
          });
          */
          return res.send({ token: tok });
        }

        const t = jwt.sign({
          email: user.email,
        }, config.tokenKey, { expiresIn: '8h' });
        // token generated
        return res.send({ token: t });
      }
      // wrong password
      return res.status(401).send('Wrong Password');
    }).catch((err) => {
      // User not found
      console.log('Errore: '.concat(err));
      res.status(401).send('User Not Found');
    });
  // teapot
  // res.status(418).send('Wrong password');
};

exports.checkToken = function checkToken(req, res) {
  try {
    // check token validity
    jwt.verify(req.headers.token, config.tokenKey);
    res.status(200).send('Ok');
  } catch (err) {
    // invavild token
    res.status(401).send('Invalid token: '.concat(err));
  }
};

exports.createUser = function createUser() {
  const salt = crypto.randomBytes(512);
  const tmp = new UserModel();
  tmp.username = 'TestUser';
  tmp.salt = salt.toString();
  tmp.password_hash_salt = crypto.pbkdf2Sync('test',
    salt.toString(),
    iterations,
    keyLen,
    digest).toString();
  tmp.name = 'TestName';
  tmp.surname = 'TestSurname';
  tmp.email = 'test@test.it';
  tmp.birth_date = new Date().toISOString();
  tmp.save((err, user) => {
    if (err) {
      global.log('Error while creating new user'); // DEBUG
      global.log(err);
      // res.send(err);
    } else {
      global.log(`User created: ${user}`); // DEBUG
    }
    // res.status(201).json(meal);
  });
};
