const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const { Model } = require("objection");
const { Dog } = require("./models/Dog");

app.use(bodyParser.json());

const pg = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "segredo",
    database: "dogs",
  },
  migrations: {
    tableName: "knex_migrations",
  },
});

Model.knex(pg);

app.get("/dogs", async (req, res) => {
  try {
    const dogs = await Dog.query();

    if (dogs) {
      res.json(dogs);
    }

    throw Error("There are no dogs");
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/dogs/:id", async (req, res) => {
  try {
    const dog = await Dog.query().findById(req.params.id);

    if (dog) {
      res.json(dog);
    }

    throw Error(`Dog with id "${req.params.id}" does not exist`);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(3000, function () {
  console.log("running on 3000!");
});
