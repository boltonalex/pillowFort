const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const investmentsRouter = require("./routes/investments");
const fundsRouter = require("./routes/funds");
const kycRouter = require("./routes/kyc");
const authRouter = require("./routes/auth");

const app = express();

dotenv.config();


const allowedOrigins = [
  "http://localhost:5173",
  "https://accounts.google.com",
  process.env.FE_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/investments", investmentsRouter);
app.use("/api/funds", fundsRouter);
app.use("/api/kyc", kycRouter);
app.use("/api/auth", authRouter);

module.exports = app;