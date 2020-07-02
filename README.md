# api-dogs

O meu projeto é uma API REST feita em NodeJS, com ExpressJS, o KnexJS com Postgres e ObjectionJS como ORM. É uma API de cachorros. Escolhi esse tema para fazer um projeto mais descontraído.

Segue o link do projeto no ar: (https://bomcachorro.herokuapp.com/dogs)

Usei a funcionalidade _built int_ do Knek de seeds para criar uma _seed_(quantidade de dados para injetar no banco).
Usei migrations, também uma funcionalidade _built in_ do Knex, aí sempre consigo rodar as tabelas do jeito que determinei em qualquer lugar, simplesmente rodando o comando de rodar a migration. Segundo a documentação do [KnexJS](http://knexjs.org/#Migrations)

Minha tabela via migration usando knex:

```js
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
```

Usei o OjectionJS como ORM para manipular meus dados via OO da seed e Model.
Aqui retorno via Objection minha tabela "dogs".

```js
class Dog extends Model {
  static tableName = "dogs";
}

exports.Dog = Dog;
```

Os meus dados para criar a seed ficou uma espécie de Frankenstein, pois alguns eu gerei e retornei de forma randômica para ter dados diferentes e outras peguei de APIs que encontrei.

- Usei uma lib que encontrei no Github chamada “dog-names”, que basicamente são vários nomes de cachorros, divididos por gênero.

Criei na mão uma “descrição” de forma randômica para cada cachorro.
Criei alguns arrays com trechos de “traços de personalidades” e usei a função sample da lib lodash (uma lib com diversas funções para trabalhar com arrays em JS)

Meus arrays:

```js
const lives_in = [
  "in a house",
  "in an apartment",
  "in a condo",
  "in a suite",
  "in a flat",
];
const owner = [
  "a woman",
  "a man",
  "a big family",
  "an old woman",
  "an old man",
  "an old couple",
  "a young couple",
];
const personality = [
  "steal blankets",
  "play in the dirt",
  "chew on rubber balls",
  "play in the mud",
  "steal tennis balls",
  "play with food",
  "play with shoes",
  "pee on shoes",
  "chew on plants",
  "play with squeaky toys",
];
```

Gerando uma bio:

```js
const bio = `${name} is a ${breed} and lives ${sample(lives_in)} with ${sample(
  owner
)} and is known to ${sample(personality)} `;
```

As fotos eu peguei via API do Unsplash. Criei uma conta lá, gerei meu token e a partir daí retornei a foto e o _alt_ das fotos.
A API do Unsplash usa o Fetch para retornar os dados.
Carreguei uma lib node-fetch para poder usar o fetch via NodeJs.

Aqui eu pego as fotos do Unsplash via fetch (implementação do Unsplash), passo o número de _dogs_ por raça que eu quero que a _seed_ crie (6).

```js
try {
    const bulldogsResponse = await unsplash.photos.getRandomPhoto({
      collections: ["9583064"],
      count: 6,
    });

    let bulldogs = await bulldogsResponse.json();
```

- Gerei um número randômico e usei esse número para determinar se o cachorro seria macho ou fêmea e baseado nisso retorno um nome.

```js
const isMale = Math.random() >= 0.5;
const name = isMale ? dogNames.maleRandom() : dogNames.femaleRandom();
```

Dentro da função getRandomPhoto eu uso a Classe Dog para tratar meus atributos.

```js
class Dog {
  constructor({ name, breed, img, alt_img, bio, genre, good_dog }) {
    this.name = name;
    this.breed = breed;
    this.img = img;
    this.alt_img = alt_img || `A photo of a ${breed}`;
    this.bio = bio;
    this.genre = genre;
    this.good_dog = good_dog;
  }

  getDogData() {
    return {
      name: this.name,
      breed: this.breed,
      img: this.img,
      genre: this.genre,
      alt_img: this.alt_img,
      bio: this.bio,
      good_dog: this.good_dog,
    };
  }
}
```

Nas minhas rotas:

Aqui retorno todos os cachorros do banco usando a minha classe Dog da model:

```js
app.get("/dogs", async (req, res) => {
  try {
    const dogs = await Dog.query();
```

Via post insiro as informações no banco de dados:

```js
app.post("/dogs", async (req, res) => {
  try {
    const dog = await Dog.query().insert({
      name: req.body.name,
      breed: req.body.breed,
      img: req.body.img,
      genre: req.body.genre,
      bio: req.body.bio,
    });
```

Aqui fiz uma consulta via SQL puro para retornar apenas 2 cães por raça:

```js
app.get("/dogs/breeds", async (req, res) => {
  try {
    const dogs = await knex.raw(
      "WITH cte as (select *, ROW_NUMBER() OVER (PARTITION BY breed ORDER BY id desc) row_numer from dogs) select * from cte where row_numer < 3"
    );
```

Aqui retorno um cão específio, por id.

```js
app.get("/dogs/:breed/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dog = await Dog.query().findById(id);
```

Aqui tenho um contador em que adiciono + 1 "bom cachorro" ao cachorro.

```js
app.patch("/dogs/:breed/:id/gooddog", async (req, res) => {
  try {
    const id = req.params.id;
    const dog = await Dog.query().patchAndFetchById(id, {
      good_dog: raw("good_dog + 1"),
    });
```

E por fim, tem a procfile e o script no package.json "heroku-postbuild" são configurações para o deploy no Heroku.
