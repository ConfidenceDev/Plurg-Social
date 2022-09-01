const { write, read } = require("../utils/file");
const Run = require("../data/run.json");
const Defaults = require("../data/defaults.json");
const Profiles = require("../data/profiles.json");

const rPath = "./data/run.json";
const pPath = "./data/profiles.json";

//============= DATA ====================
async function getRun() {
  return new Promise((resolve, reject) => {
    try {
      resolve(Run.run);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function setRun() {
  return new Promise(async (resolve, reject) => {
    try {
      Run.run = true;
      await write(rPath, Run);
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function defaultProfile() {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(Defaults[Math.floor(Math.random() * Defaults.length)]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function getProfile() {
  return new Promise(async (resolve, reject) => {
    try {
      read(pPath)
        .then((data) => {
          const rel = JSON.parse(data);
          if (rel.length < 1) {
            resolve(Defaults[Math.floor(Math.random() * Defaults.length)]);
          } else {
            resolve(rel[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function writeProfile(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      if (obj.next === false) {
        Profiles.push(obj);
        await write(pPath, Profiles);
        const pos = Profiles.findIndex((item) => item.id === obj.id);
        resolve(pos);
      } else {
        Profiles.unshift(obj);
        await write(pPath, Profiles);
        resolve(null);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function removeProfile(obj) {
  return new Promise(async (resolve, reject) => {
    try {
      const pos = Profiles.findIndex((p) => p.id === obj.id);
      if (pos > -1) {
        Profiles.splice(pos, 1);
        await write(pPath, Profiles);
      }
      resolve();
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = {
  getRun,
  setRun,
  defaultProfile,
  getProfile,
  writeProfile,
  removeProfile,
};
