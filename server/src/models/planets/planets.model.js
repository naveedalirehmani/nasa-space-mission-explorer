const { parse } = require('csv-parse');
const path = require('path');
const fs = require('fs');

const planetModel = require('./planets.mongo');

const result = [];

const isHabitable = (planet) => {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
};

function getPlanetsData() {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'keplerData.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        if (isHabitable(data)) {
          // result.push(data);
          saveAPlanet(data);
        }
      })
      .on('error', (error) => {
        console.log(error, 'error');
        reject(error);
      })
      .on('end', async () => {
        const planetsCount = (await getAllPlanets()).length;
        console.log(planetsCount + ' Habitable planets', planetsCount); 
        resolve(result);
      });
  });
}

async function getAllPlanets() {
  return await planetModel.find({},{'_id':0,'__v':0});
}

async function saveAPlanet(planet) {
  try {
    await planetModel.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.log('could not save a planet', error);
  }
}

module.exports = {
  getAllPlanets,
  getPlanetsData,
};
