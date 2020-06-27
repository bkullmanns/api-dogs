// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "dogs",
      user: "",
      password: "segredo",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
