const express = require("express");
const { admin, db } = require("../config/firebase");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure auth middleware is imported
const router = express.Router();

// Reference Firestore
const investmentsCollection = db.collection("investments");

// ✅ Apply authMiddleware before all protected routes
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fundId, amount } = req.body;
    const userId = req.user.uid; // ✅ req.user should now be defined

    if (!fundId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Store investment in Firestore
    const newInvestment = await investmentsCollection.add({
      userId,
      fundId,
      amount,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
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
  console.log("✅ GET /api/investments/:userId hit");

  try {
    const { userId } = req.params; // Extract userId from the URL path
    console.log(`🔍 Fetching investments for user: ${userId}`);

    const snapshot = await investmentsCollection.where("userId", "==", userId).get();
    console.log(`📊 Firestore Query Snapshot Size: ${snapshot.size}`);

    if (snapshot.empty) {
      console.log("❌ No investments found for this user.");
      return res.status(200).json([]);
    }

    const investments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Investments Found:", investments);
    res.json(investments);

  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.get("/", authMiddleware, async (req, res) => {
//   console.log('req.user', req.user)
//   try {
//     const userId = req.user.uid;
//     console.log(`🔍 Fetching investments for user: ${userId}`);

//     const snapshot = await investmentsCollection.where("userId", "==", userId).get();

//     console.log(`📊 Firestore Query Snapshot Size: ${snapshot.size}`);

//     if (snapshot.empty) {
//       console.log("❌ No investments found for this user.");
//       return res.status(200).json([]);
//     }
//     const investments = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.json(investments);

//   } catch (error) {
//     console.error("❌ Firestore Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // ✅ Apply authMiddleware for GET /api/investments
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const snapshot = await investmentsCollection.where("userId", "==", userId).get();

//     if (snapshot.empty) {
//       return res.status(200).json([]);
//     }

//     const investments = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     res.json(investments);

//   } catch (error) {
//     console.error("❌ Firestore Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });



module.exports = router;