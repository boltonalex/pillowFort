const fs = require('fs');
const path = require('path');
const admin = require("firebase-admin");
const axios = require("axios");
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
});

// Function to generate an ID token
async function generateIdToken(uid) {
  try {
    // Step 1: Generate a custom token
    const customToken = await admin.auth().createCustomToken(uid);
    console.log("✅ Generated Custom Token:", customToken);

    // Step 2: Exchange custom token for ID token
    const firebaseApiKey = process.env.FIREBASE_API_KEY; // API Key from Firebase Console
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseApiKey}`,
      {
        token: customToken,
        returnSecureToken: true
      }
    );

    const idToken = response.data.idToken;
    console.log("✅ Generated ID Token:", idToken);

    // Step 3: Save ID Token to .env file
    const envPath = path.join(__dirname, '../.env');

    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or add FIREBASE_TEST_TOKEN
    const updatedEnv = envContent.includes("FIREBASE_TEST_TOKEN=")
      ? envContent.replace(/FIREBASE_TEST_TOKEN=.*/, `FIREBASE_TEST_TOKEN=${idToken}`)
      : `${envContent}\nFIREBASE_TEST_TOKEN='${idToken}'\n`;

    fs.writeFileSync(envPath, updatedEnv, 'utf8');
    console.log("✅ Firebase ID token saved to .env file!");

  } catch (error) {
    console.error("❌ Error generating Firebase ID token:", error.response ? error.response.data : error.message);
  }
}

// Call the function with a test user ID
generateIdToken(process.env.FIREBASE_TEST_USER_ID);