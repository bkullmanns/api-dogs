const { Model } = require("objection");

class Dog extends Model {
  static get tableName() {
    return "dogs";
  }
}

exports.Dog = Dog;
