const express = require("express");
const multer = require("multer");
const { db } = require("../config/firebase");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const usersCollection = db.collection("users");

router.post("/", authMiddleware, upload.single("idFile"), async (req, res) => {
  const { user, name, dob, address, email } = req.body;
  const idFile = req.file;

  if (!user || !name || !dob || !address) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const userRef = usersCollection.doc(user);
    const kycData = {
      kycVerified: true,
      name,
      dob,
      email,
      address,
      idUploaded: true, //TODO make file upload to document storage
      updatedAt: new Date(),
      kycVerified: true
    };

    await userRef.set(kycData, { merge: false });

    res.json({ message: "KYC submitted successfully", kycVerified: true });
  } catch (error) {
    console.error("KYC Submission Failed:", error);
    res.status(500).json({ error: "Failed to submit KYC." });
  }
});

module.exports = router;