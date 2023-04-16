const launchesMongoModel = require("./launches.mongo.js");
const planetsMongoModel = require("../planets/planets.mongo");
const axios = require("axios");

const DEFAULT_FLIGHT = {
  flightNumber: 100,
};

async function getAllLaunches({skip,limit}) {
  return await launchesMongoModel.find({}, { _id: 0, __v: 0 }).skip(skip).limit(limit).sort({flightNumber:1});
}

async function getLatestFlightNumber() {
  const latest = await launchesMongoModel
    .findOne({}, { flightNumber: 1 })
    .sort({ flightNumber: -1 });

  if (!latest) {
    return DEFAULT_FLIGHT;
  }

  return latest;
}

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLunchesData() {
  console.log("downloading launch data");

  const spaceXDataExist = await findLaunch({
    flightNumber: 1,
    rocker: "Falcon 1",
    mission: "FalconSat",
  });

  if (spaceXDataExist) {
    console.log("launch data already loaded.");
  } else {
    await populateLaunches();
  }
}

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200) {
    console.log('problem downlaoding launch data')
    throw new Error('Launch data download failed')
  }

  const launchDocs = response.data.docs;

  for (const doc of launchDocs) {
    const payloads = doc["payloads"];
    const customers = payloads.flatMap((payloads) => {
      return payloads["customers"];
    });

    const launch = {
      flightNumber: doc["flight_number"],
      mission: doc["name"],
      rocket: doc["rocket"]["name"],
      launchDate: doc["date_local"],
      upcoming: doc["upcoming"],
      success: doc["success"],
      customers,
    };
    console.log('saving new launch')
    await saveLaunch(launch);
  }
}

async function findLaunch(filter) {
  return await launchesMongoModel.findOne(filter);
}

async function saveLaunch(launch) {
  await launchesMongoModel.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await findLaunch({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was found.");
  }

  const newFlightNumber = await getLatestFlightNumber();

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "NASA"],
    flightNumber: newFlightNumber.flightNumber + 1,
  });

  await saveLaunch(newLaunch);
}

async function launchWithIdExists(id) {
  return await launchesMongoModel.findOne({ flightNumber: id });
}

async function abortMissionById(id) {
  const abortedLaunch = await launchesMongoModel.updateOne(
    { flightNumber: id },
    { success: false, upcoming: false },
    { new: true }
  );
  return abortedLaunch.acknowledged;
}

module.exports = {
  getAllLaunches,
  launchWithIdExists,
  abortMissionById,
  scheduleNewLaunch,
  loadLunchesData,
};
