exports.up = function (knex) {
  return knex.schema.createTable("dogs", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("breed");
    table.string("img");
    table.string("genre");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("dogs");
};
