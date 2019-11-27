const crypto = require('crypto');
const fs = require('fs');
const config = require('../../config.json');

exports.getPublicKey = function getPublicKey(_req, res) {
  res.json(fs.readFileSync(config.publicKeyFile, { encoding: 'utf8' }));
};

exports.getPrivateKey = function getPrivateKey() {

};

exports.genKeyPair = function genKeyPair() {
  const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: config.privateKeyPass,
    },
  });
  // use config file
  fs.writeFile('publcKey.txt', keyPair.publicKey, (err) => {
    if (err) global.log(err);
    global.log('Saved publicKey!');
  });
  fs.writeFile('privteKey.txt', keyPair.privateKey, (err) => {
    if (err) global.log(err);
    global.log('Saved privateKey!');
  });
};
