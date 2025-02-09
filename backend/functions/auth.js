const express = require("express");
const router = express.Router();
const { db } = require('./config/firebase');
const authMiddleware = require("./middlewares/authMiddleware"); // Ensure auth middleware is imported

const usersCollection = db.collection("users");


const makeNewUserDoc = async (userId) => {
  const userRef = usersCollection.doc(userId); // ✅ Specify document ID
  await userRef.set({
    userId,
    createdAt: new Date(),
    address: null,
    dob: null,
    email: null,
    name: null,
    idUploaded: false,
    kycVerified: false,
  });
  return (await userRef.get()).data();
}

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const userRef = usersCollection.doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      const newUser = await makeNewUserDoc(userId);
      return res.status(201).json(newUser);
    }
    return res.json(userSnap.data());

  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;