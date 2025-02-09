import express from "express";
// import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

export default (req, res) => app(req, res);