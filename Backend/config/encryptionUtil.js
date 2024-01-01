const bcrypt = require('bcrypt');
const saltValue = 10;

module.exports.generatePasswordHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltValue, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, function (err, hash) {
        resolve(hash);
      });
    });
  });
};

module.exports.comparePassword = (plainPass, hashPass) => {
  return new Promise(function (resolve, reject) {
    try {
      bcrypt.compare(plainPass, hashPass, function (err, isPasswordMatch) {
        if (!err) resolve(isPasswordMatch);
        else reject(err);
      });
    } catch (e) {
      rejected(e);
    }
  });
};
