const { write } = require("../utils/write");
const Defaults = require("../data/defaults.json");
const Profiles = require("../data/profiles.json");

const pPath = "./data/profiles.json";

//============= DATA ====================
async function getProfile() {
  return new Promise((resolve) => {
    try {
      if (Profiles[0] === null || Profiles[0] === undefined) {
        resolve(Defaults[Math.floor(Math.random() * Defaults.length)]);
      } else {
        resolve(Profiles[0]);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function writeProfile(obj) {
  return new Promise((resolve) => {
    try {
      if (obj.next === false) {
        Profiles.push(obj);
        write(pPath, Profiles);
        resolve(obj);
      } else {
        Profiles.unshift(obj);
        write(pPath, Profiles);
        resolve(obj);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

async function removeProfile() {
  return new Promise((resolve) => {
    try {
      Profiles.pop();
      write(pPath, Profiles);
      resolve();
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = {
  getProfile,
  writeProfile,
  removeProfile,
};
