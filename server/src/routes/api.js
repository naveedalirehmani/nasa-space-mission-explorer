const { Router } = require('express');
const app = Router();

const planetRouter = require('./planets/planets.router.js');
const launchesRouter = require('./launches/launches.router.js');

app.use('/planets', planetRouter);
app.use('/launches', launchesRouter);

module.exports = app;
