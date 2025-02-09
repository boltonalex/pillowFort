const express = require("express");
const multer = require("multer");
const { db } = require("./config/firebase");

const authMiddleware = require("./middlewares/authMiddleware");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const usersCollection = db.collection("users");

router.post("/:userId", authMiddleware, upload.single("idFile"), async (req, res) => {
  const { title, firstName, lastName, dob, postcode, email } = req.body;
  const idFile = req.file;
  const { userId } = req.params;

  try {
    const userRef = usersCollection.doc(userId);
    const kycData = {
      title,
      firstName,
      lastName,
      dob,
      email,
      postcode,
      idUploaded: true, //TODO make file upload to document storage
      updatedAt: new Date(),
      kycVerified: true,
      newsletter: true
    };

    await userRef.set(kycData, { merge: false });

    res.json({ message: "KYC submitted successfully", kycVerified: true });
  } catch (error) {
    console.error("KYC Submission Failed:", error);
    res.status(500).json({ error: "Failed to submit KYC." });
  }
});

module.exports = router;