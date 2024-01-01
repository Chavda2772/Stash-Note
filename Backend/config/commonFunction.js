const generateUniqueId = require('generate-unique-id');

module.exports.generateUniqueSyncID = () => {
  return generateUniqueId({
    length: 48,
    useLetters: true,
  });
};
