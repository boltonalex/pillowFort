const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

const KEY = process.env.SERVICE_ACCOUNT_KEY;

const serviceAccount = JSON.parse(KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = getFirestore();
module.exports = { admin, db };