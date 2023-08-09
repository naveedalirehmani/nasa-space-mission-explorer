const {Router} = require('express');
const planetsController = require('./planet.controller.js');

const planetRouter = Router();

// THIS WILL GETS ALL PLANETS DATA FROM MONGO
planetRouter.get('/',planetsController.getAllPlanetsFromMongo);


module.exports = planetRouter;