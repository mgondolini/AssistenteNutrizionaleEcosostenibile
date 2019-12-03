const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keyController = require('./keyController.js');
const config = require('../../config.json');

const UserModel = mongoose.model('User');
const iterations = 420;
const keyLen = 512;
const digest = 'sha512';

exports.auth = function auth(req, res) {
  const query = { email: req.params.email };
  UserModel.findOne(query)
    .exec()
    .then((user) => {
      const psw = crypto.privateDecrypt(keyController.getPrivateKey(),
        Buffer.from(req.body.key)).toString();
      const pswHash = crypto.pbkdf2Sync(psw, user.salt.toString('hex'), iterations, keyLen, digest);
      if (pswHash === user.password_hash_salt) {
        res.status(200);
        const t = jwt.sign({
          email: user.email,
          salt: user.salt,
        }, config.tokenKey, { expiresIn: '8h' });
        return res.send({ desc: 'nais giob', token: t });
      }
      return res.status(401).send('Wrong password');
    }).catch((err) => res.status(401).send(err));
  // teapot
  // res.status(418).send('Wrong password');
};

exports.createUser = function createUser() {
  const salt = crypto.randomBytes(512);
  const tmp = new UserModel();
  tmp.username = 'TestUser';
  tmp.salt = salt.toString('hex');
  tmp.password_hash_salt = crypto.pbkdf2Sync('test1234', salt.toString('hex'), iterations, keyLen, digest);
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
      global.log(`User created${user}`); // DEBUG
    }
    // res.status(201).json(meal);
  });
};
