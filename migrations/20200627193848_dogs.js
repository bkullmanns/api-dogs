exports.up = function (knex) {
  return knex.schema.createTable("dogs", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("breed");
    table.string("img");
    table.string("alt_img");
    table.string("bio");
    table.string("genre");
    table.integer("good_dog").default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("dogs");
};
