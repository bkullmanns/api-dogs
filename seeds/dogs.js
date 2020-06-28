const dogNames = require("dog-names");
const fetch = require("node-fetch");
const Unsplash = require("unsplash-js").default;

const unsplash = new Unsplash({
  accessKey: "DEbmZr1CHKdZ3OJD-fz0JnA_jj03qGTmX6C9qgndggs",
});

global.fetch = fetch;

const getRandomDog = (photo, breed) => {
  const isMale = Math.random() >= 0.5;

  return {
    name: isMale ? dogNames.maleRandom() : dogNames.femaleRandom(),
    breed,
    img: photo.urls.raw,
    genre: isMale ? "male" : "female",
  };
};

exports.seed = async function (knex) {
  try {
    const pugsResponse = await unsplash.photos.getRandomPhoto({
      collections: ["1120118"],
      count: 3,
    });

    let pugs = await pugsResponse.json();
    pugs = pugs.map((photo) => getRandomDog(photo, "pug"));

    const corgiResponse = await unsplash.photos.getRandomPhoto({
      collections: ["3336303"],
      count: 3,
    });

    let corgis = await corgiResponse.json();
    corgis = corgis.map((photo) => getRandomDog(photo, "corgi"));

    return knex("dogs")
      .del()
      .then(function () {
        // Inserts seed entries
        return knex("dogs").insert([...corgis, ...pugs]);
      });
  } catch (error) {
    console.log(error);
  }
};
