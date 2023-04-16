const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const {getPlanetsData} = require('../../models/planets/planets.model')
describe('lanches API', () => {

  beforeAll(async () => {
    await mongoConnect()
    await getPlanetsData()
  })

  afterAll(async () => {
    await mongoDisconnect()
  })


  describe("getAllLaunches-test", () => {
    test("get should response with 200", async () => {
      jest.setTimeout(10000);
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
      // expect(response.statusCode).toBe(200)
    });
  });

  describe("addNewLaunch-test", () => {

    const completeLaunchData = {
      mission: "Kepler Exploration Y",
      rocket: "Kepler IS2",
      launchDate: "January 7, 2030",
      target: "Kepler-452 b",
    };

    const launchDataWithDate = {
      mission: "Kepler Exploration Y",
      rocket: "Kepler IS2",
      // launchDate: "January 7, 2030",
      target: "Kepler-452 b",
    };

    test("launch date creation 201 pass", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject(launchDataWithDate);
    });

    test("launch data with missing field", async () => {

      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({ error: "missing launch field" });

    });

    test("launch data with invalid date", async () => {

      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "Kepler Exploration Y",
          rocket: "Kepler IS2",
          launchDate: "invalid date",
          target: "Kepler-442 b2",
        })
        .expect(400)
        .expect("Content-Type", /json/);

    });
  });

})

