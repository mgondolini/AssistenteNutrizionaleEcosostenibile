const crypto = require('crypto');
const fs = require('fs');
const config = require('../../config.json');

exports.getPrivateKey = function getPrivateKey() {
  const keyEnc = fs.readFileSync(config.privateKeyFile, { encoding: 'utf8' });
  return crypto.createPrivateKey({
    key: keyEnc,
    type: 'pkcs8',
    format: 'pem',
    passphrase: config.privateKeyPass,
  });
};

exports.getPublicKey = function getPublicKey(_req, res) {
  const pk = fs.readFileSync(config.publicKeyFile, { encoding: 'utf8' });
  res.json({ publicKey: pk });
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
