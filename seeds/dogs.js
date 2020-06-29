require("dotenv").config();
const dogNames = require("dog-names");
const fetch = require("node-fetch");
const Unsplash = require("unsplash-js").default;
const sample = require("lodash.sample");

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_KEY,
});

global.fetch = fetch;

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

const getRandomDog = (photo, breed) => {
  const isMale = Math.random() >= 0.5;
  const name = isMale ? dogNames.maleRandom() : dogNames.femaleRandom();

  const bio = `${name} is a ${breed} and lives ${sample(
    lives_in
  )} with ${sample(owner)} and is known to ${sample(personality)} `;

  const dog = new Dog({
    name,
    breed,
    img: photo.urls.raw,
    alt_img: photo.alt_description,
    genre: isMale ? "male" : "female",
    bio: bio,
  });

  return dog.getDogData();
};

exports.seed = async function (knex) {
  knex.raw("ALTER TABLE dogs AUTO_INCREMENT = 1");

  try {
    const bulldogsResponse = await unsplash.photos.getRandomPhoto({
      collections: ["9583064"],
      count: 6,
    });

    let bulldogs = await bulldogsResponse.json();

    bulldogs = bulldogs.map((photo) => getRandomDog(photo, "bulldog"));

    const pugsResponse = await unsplash.photos.getRandomPhoto({
      collections: ["1120118"],
      count: 6,
    });

    let pugs = await pugsResponse.json();
    pugs = pugs.map((photo) => getRandomDog(photo, "pug"));

    const corgiResponse = await unsplash.photos.getRandomPhoto({
      collections: ["3336303"],
      count: 6,
    });

    let corgis = await corgiResponse.json();
    corgis = corgis.map((photo) => getRandomDog(photo, "corgi"));

    const huskyResponse = await unsplash.photos.getRandomPhoto({
      collections: ["9007843"],
      count: 6,
    });

    let huskies = await huskyResponse.json();
    huskies = huskies.map((photo) => getRandomDog(photo, "husky"));

    return knex("dogs")
      .del()
      .then(function () {
        return knex("dogs").insert([
          ...corgis,
          ...pugs,
          ...huskies,
          ...bulldogs,
        ]);
      });
  } catch (error) {
    console.log(error);
  }
};
