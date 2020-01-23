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
    .then((us) => {
      // User found
      const psw = req.body.key;
      const salt = us.salt.toString();
      const pswHash = crypto.pbkdf2Sync(psw,
        salt,
        iterations,
        keyLen,
        digest).toString();
      if (pswHash === us.password_hash_salt) {
        // Correct password
        res.status(200);

        // TODO REMOVE ME
        if (req.body.email === 'test@test.it') {
          const tok = jwt.sign({
            email: us.email,
            user: us.username,
          }, config.tokenKey);
          return res.send({ token: tok, user: us.username });
        }

        const t = jwt.sign({
          email: us.email,
          user: us.username,
        }, config.tokenKey, { expiresIn: '8h' });
        // token generated
        return res.send({ token: t, user: us.username });
      }
      // wrong password
      return res.status(401).send('Wrong Credential');
    }).catch(() => {
      // User not found
      res.status(401).send('User Credential');
    });
};

function getUs(token) {
  try {
    return jwt.verify(token, config.tokenKey).user;
  } catch (err) {
    return '';
  }
}

exports.checkOldToken = function checkOldToken(req, res) {
  try {
    // check old token validity
    jwt.verify(req.headers.token, config.tokenKey);
    res.status(200).send('Ok');
  } catch (err) {
    // invavild token, no error
    res.status(200).send('Invalid token');
  }
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

exports.getUsername = function getUsername(token) {
  return getUs(token);
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
