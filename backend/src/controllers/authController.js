const crypto = require('crypto');
const keyController = require('./keyController.js');

exports.auth = function auth(req, res) {
  global.log(req.body);
  res.status(200);
  // req.body.user
  const psw = crypto.privateDecrypt(keyController.getPrivateKey(),
    Buffer.from(req.body.key)).toString();
  // global.log(psw);
  const hash = crypto.createHash('sha256');
  hash.update(psw);
  const digest = hash.digest('hex');
  global.log(digest);
  // TODO
  // - match digest against dbHash
  // - on success generate token
};
