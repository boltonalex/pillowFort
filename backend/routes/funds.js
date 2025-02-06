const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();
const fundsCollection = db.collection('funds');

/* GET available ISA funds (Public route) */
router.get('/', async (req, res) => {
  try {
    const snapshot = await fundsCollection.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No funds found' });
    }

    const funds = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ funds });
  } catch (error) {
    console.error('Error fetching funds:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;