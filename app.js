const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");

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

app.use(bodyParser.json());

app.listen(3000, function () {
  console.log("running on 3000!");
});
