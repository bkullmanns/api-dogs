const dogNames = require("dog-names");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("dogs")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("dogs").insert([
        { id: 1, name: dogNames.maleRandom() },
        { id: 2, name: dogNames.femaleRandom() },
        { id: 3, name: dogNames.maleRandom() },
      ]);
    });
};
