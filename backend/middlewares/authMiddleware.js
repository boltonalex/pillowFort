const { getAuth } = require("firebase-admin/auth");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;