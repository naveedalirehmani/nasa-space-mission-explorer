const cors = require("cors");
const path = require("path");
const helmet = require('helmet')
const morgan = require("morgan");
const express = require("express");

const Api1 = require("./routes/api.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use("/files", express.static(path.join(__dirname, "files")));

app.use("/v1", Api1);

module.exports = app;
