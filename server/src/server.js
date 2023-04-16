const http = require("http");
const app = require("./app.js");
require('dotenv').config();

const PORT = process.env.PORT || 8000;

const { mongoConnect } = require("./services/mongo.js");

const { getPlanetsData } = require("./models/planets/planets.model.js");
const { loadLunchesData } = require("./models/launches/launches.model.js");

const server = http.createServer(app);

async function startServer() {

  await mongoConnect();
  await getPlanetsData();
  await loadLunchesData();
  
  console.log("\x1b[35m", "Planets Data Populated");
  server.listen(PORT, () => {
    console.log(" server is listning on ", PORT);
  });
}

startServer();
