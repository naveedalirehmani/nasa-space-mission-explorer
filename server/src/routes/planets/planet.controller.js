const planetsModel = require("../../models/planets/planets.model.js");

async function getAllPlanetsFromMongo(request, response) {
  const planets =  await planetsModel.getAllPlanets()  
  
  response.status(200).send(planets);
}

module.exports = {
  getAllPlanetsFromMongo,
};
