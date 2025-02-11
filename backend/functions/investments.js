const express = require("express");
const { db } = require("./config/firebase");
const authMiddleware = require("./middlewares/authMiddleware");
const router = express.Router();

const investmentsCollection = db.collection("investments");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fundId, amount } = req.body;
    const userId = req.user.uid;

    if (!fundId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newInvestment = await investmentsCollection.add({
      userId,
      fundId,
      amount,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Investment recorded",
      investmentId: newInvestment.id,
      userId,
      fundId,
      amount,
    });

  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await investmentsCollection.where("userId", "==", userId).get();
    if (snapshot.empty) {
      return res.status(200).json([]);
    }
    const investments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(investments);
  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;