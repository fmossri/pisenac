const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './smartkids.db'
  },
  useNullAsDefault: true
});

module.exports = knex;