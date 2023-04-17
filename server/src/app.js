const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const express = require("express");

const Api1 = require("./routes/api.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", Api1);

app.get("/*", (request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
