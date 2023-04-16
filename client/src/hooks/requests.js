// Load planets and return as JSON.
const API_URL = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  const response = await fetch(API_URL + '/planets')
  const data = await response.json()
  console.log(data,'planets')
  return data
  
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(API_URL+'/launches');
  const data = await response.json()
  const sortedLaunches = data.sort((a,b)=>a.flightNumber - b.flightNumber)
  return sortedLaunches
}

// TODO: Once API is ready.
// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  console.log('submited')
  try {
    return await fetch(API_URL+'/launches',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(launch)
    })    
  } catch (error) {
    console.log('error',error)
    return {
      ok:false
    }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {

  try {
    return await fetch(API_URL+'/launches/'+id,{
      method:'delete'
    })
  } catch (error) {
    console.log(error)
    return {
      ok:false,
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};