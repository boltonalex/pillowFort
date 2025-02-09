const fs = require("fs");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const FIREBASE_TOKEN = process.env.FIREBASE_TEST_TOKEN;
const USER_ID = process.env.FIREBASE_TEST_USER_ID;
const POSTMAN_API_KEY = process.env.POSTMAN_API_KEY;
const POSTMAN_ENV_NAME = process.env.POSTMAN_ENV_NAME || "PillowFort";


axios.get("https://api.getpostman.com/environments", {
  headers: { "X-Api-Key": POSTMAN_API_KEY }
})
  .then(response => {
    const environments = response.data.environments;
    const env = environments.find(e => e.name === POSTMAN_ENV_NAME);

    if (!env) {
      throw new Error(`❌ Postman environment "${POSTMAN_ENV_NAME}" not found.`);
    }

    const POSTMAN_ENV_ID = env.id;

    const postmanEnv = {
      environment: {
        values: [
          { key: "FIREBASE_TOKEN", value: FIREBASE_TOKEN, enabled: true },
          { key: "USER_ID", value: USER_ID, enabled: true }
        ]
      }
    };

    return axios.put(
      `https://api.getpostman.com/environments/${POSTMAN_ENV_ID}`,
      postmanEnv,
      { headers: { "X-Api-Key": POSTMAN_API_KEY, "Content-Type": "application/json" } }
    );
  })
  .then(() => {
  })
  .catch(error => {
    console.error("❌ Failed to update Postman environment:", error.response ? error.response.data : error.message);
  });