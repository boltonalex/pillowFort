const fs = require('fs');
const path = require('path');
const admin = require("firebase-admin");
const axios = require("axios");
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
});

async function generateIdToken(uid) {
  try {
    const customToken = await admin.auth().createCustomToken(uid);

    const firebaseApiKey = process.env.FIREBASE_API_KEY; // API Key from Firebase Console
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseApiKey}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );

    const idToken = response.data.idToken;

    const envPath = path.join(__dirname, '../.env');

    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const updatedEnv = envContent.includes("FIREBASE_TEST_TOKEN=")
      ? envContent.replace(/FIREBASE_TEST_TOKEN=.*/, `FIREBASE_TEST_TOKEN=${idToken}`)
      : `${envContent}\nFIREBASE_TEST_TOKEN='${idToken}'\n`;

    fs.writeFileSync(envPath, updatedEnv, 'utf8');

  } catch (error) {
    console.error("❌ Error generating Firebase ID token:", error.response ? error.response.data : error.message);
  }
}

generateIdToken(process.env.FIREBASE_TEST_USER_ID);