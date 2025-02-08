const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebase");
const authMiddleware = require("../middlewares/authMiddleware"); // Ensure auth middleware is imported

const usersCollection = db.collection("users");


const makeNewUserDoc = async (userId) => {
  const newUser = await usersCollection.add({
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    address: null,
    dob: null,
    email: null,
    name: null,
    idUploaded: false,
    kycVerified: false,
  });
  return newUser;
}

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const userRef = usersCollection.doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap) {
      const newUser = await makeNewUserDoc(userId);
      return res.status(201).json(newUser);
    }
    res.json(userSnap.data());

  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.patch("/:userId", authMiddleware, async (req, res) => {
// try {
// console.log('patch user')
// const { userId } = req.params;
// const { providerData } = req.body;

// const snapshot = await usersCollection.where("userId", "==", userId).get();

// //if there is no user, add all the data into a new one
// if (snapshot.empty) {
//   const newUser = await usersCollection.add({
//     userId,
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     address: null,
//     dob: null,
//     email: providerData.email, //TODO: fetch from SSO or userData
//     name: providerData.displayName,
//     idUploaded: false,
//     kycVerified: false,
//   });
//   return res.status(201).json(newUser);
// }
// console.log({ snapshot })



// const updatedUser = await snapshot.updateDoc({
//   // ...doc,
//   email: providerData.email,
//   name: providerData.displayName,
// })
// return res.status(201).json(updatedUser);
//   } catch (error) {
//     console.error("❌ Firestore Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });





module.exports = router;