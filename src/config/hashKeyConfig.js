/* how secure should your bcrypt be? Higher #rounds is expensive
see https://www.npmjs.com/package/bcrypt#a-note-on-rounds */
const saltRound = '1OJ3YQeOU4UOAftW7VugpxLyjoJEChmHV2wCxlh7qN2WL40hsAyA27MEKD9yCKsUyX0INWVtxxBYEvIw4Gr11b71QIdOYTSRqWuNSONThTXwCvtAw4c9yCaQO0KdQpyq';
const iteration = 10000;

module.exports = { saltRound, iteration };