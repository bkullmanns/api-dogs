const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const { Model, raw } = require("objection");
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
      return res.json(dogs);
    }

    throw Error("There are no dogs");
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/dogs", async (req, res) => {
  try {
    const dog = await Dog.query().insert({
      name: req.body.name,
      genre: req.body.genre,
      img: req.body.img,
      breed: req.body.breed,
    });
    if (dog) {
      return res.json(dog);
    }
    throw Error("Error while trying to insert a new dog");
  } catch (error) {
    return res.json({ error: error.message });
  }
});

app.get("/dogs/breeds", async (req, res) => {
  try {
    const dogs = await pg.raw(
      "WITH cte as (select *, ROW_NUMBER() OVER (PARTITION BY breed ORDER BY id desc) row_numer from dogs) select * from cte where row_numer < 3"
    );

    if (dogs) {
      return res.json(dogs.rows);
    }

    throw Error("There are no dogs");
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/dogs/:breed", async (req, res) => {
  try {
    const breed = req.params.breed;
    const dogs = await Dog.query().where("breed", breed);

    if (dogs) {
      return res.json(dogs);
    }

    throw Error(`There are no dogs of breed "${breed}"`);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.get("/dogs/:breed/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dog = await Dog.query().findById(id);

    if (dog) {
      return res.json(dog);
    }

    throw Error(`Dog with id "${id}" does not exist`);
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(3000, function () {
  console.log("running on 3000!");
});
