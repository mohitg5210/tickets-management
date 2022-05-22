const { knexSnakeCaseMappers } = require('objection');
const config = require('../config/config')
module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: config.pgDatabase,
      user: config.pgUser,
      password: config.pgPassword,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    ...knexSnakeCaseMappers(),
  },
};
