const launchesModel = require("../../models/launches/launches.model");
const getPagination = require('../../services/query.js');

async function httpGetAllLaunches(request, response) {

  const {skip,limit} = getPagination(request.query)
  
  const launches = await launchesModel.getAllLaunches({skip,limit});
  return response.status(200).json(launches);
}

async function httpAddNewLaunch(request, response) {
  const launch = request.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return response.status(400).json({ error: "missing launch field" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (launch.launchDate.toString() === "Invalid Date") {
    return response.status(400).json({
      error: "invalid date format",
    });
  }

  await launchesModel.scheduleNewLaunch(launch);

  return response.status(201).json(launch);
}

async function httpAbortLaunch(request, response) {
  const id = +request.params.id;

  const launch = await launchesModel.launchWithIdExists(id);

  if (!launch) {
    return response
      .status(404)
      .json({ error: "launch with id does not exits" });
  }

  const abortedLaunch = await launchesModel.abortMissionById(id);

  if(!abortedLaunch){
    response.status(400).json({
      error:'Launch not aborted'
    })
  }
  
  return response.status(200).json(abortedLaunch);
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
