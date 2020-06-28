const { Model } = require("objection");

class Dog extends Model {
  static tableName = "dogs";
}

exports.Dog = Dog;
