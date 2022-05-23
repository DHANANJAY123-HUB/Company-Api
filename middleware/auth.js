const jwt = require('JsonWebToken');

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    console.log(token)
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.data = decoded;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token"+ err.message);
  }
  
};

module.exports = verifyToken;