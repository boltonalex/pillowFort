const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");

const investmentsRouter = require("./investments");
const fundsRouter = require("./funds");
const kycRouter = require("./kyc");
const authRouter = require("./auth");

const app = express();

app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello from Firebase!!!!!!" });
});

app.use("/funds", fundsRouter);
app.use("/investments", investmentsRouter);
app.use("/kyc", kycRouter);
app.use("/auth", authRouter);

exports.api = functions.https.onRequest(app);