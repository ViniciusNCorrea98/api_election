const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'eleicoes',
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  }
});

module.exports = knex;