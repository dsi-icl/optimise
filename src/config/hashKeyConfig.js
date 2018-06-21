/* how secure should your bcrypt be? Higher #rounds is expensive
see https://www.npmjs.com/package/bcrypt#a-note-on-rounds */
const saltRound = 12;

module.exports = saltRound;