const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token.split(" ")[1], "pQ7&kW9#zYs2$rL5@hN3!", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Failed to authenticate token" });
    }

    req.decoded = decoded;
    next();
  });
}

module.exports = verifyToken;
