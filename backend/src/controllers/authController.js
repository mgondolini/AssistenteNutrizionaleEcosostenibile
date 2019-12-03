const crypto = require('crypto');
const mongoose = require('mongoose');
const keyController = require('./keyController.js');

const UserModel = mongoose.model('User');

exports.auth = async function auth(req, res) {
  const iterations = 42;
  const keyLen = 512;
  const digest = 'sha512';
  const query = { email: req.params.email };
  let user;
  await UserModel.findOne(query)
    .exec()
    .then((us) => {
      user = us;
    }).catch((err) => { res.status(404).send(err); return res; });
  global.log(req.body);
  global.log(user);
  // req.body.user
  const psw = crypto.privateDecrypt(keyController.getPrivateKey(),
    Buffer.from(req.body.key)).toString();
  // global.log(psw);
  // const hash = crypto.createHash('sha256');
  // hash.update(psw);
  // hash.update(req.body.key);
  // const digest = hash.digest('hex');
  const pswHash = crypto.pbkdf2Sync(psw, user.salt, iterations, keyLen, digest);
  if (pswHash === user.password_hash_salt) {
    global.log('Psw match!');
  } else {
    res.status(418).send('Wrong password');
    return res;
  }
  global.log(digest);
  global.log(req.params);
  return res.status(200).send({ desc: 'nais giob' });
  //
  //
  // TODO
  // - match digest against dbHash
  // - on success generate token
};
