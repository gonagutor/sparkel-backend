/**
 * Generates a random string of specified length
 * @param {Number} characterCount Amount of characters to generate
 * @returns {string} Random string with characterCount length
 */
export default (characterCount) => {
  const availableCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJLLMNOPQRSTUVWXYZ';
  let ret = '';
  for (let i = 0; i < characterCount; i += 1) {
    ret += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
  }
  return ret;
};
