import jwt from 'jsonwebtoken';

const key = process.env.SECRET_KEY
export const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization']

  if (!token){
    return res.status(401).send({ message : 'Token is required'});
  }
console.log(token)

  
  if (!token) return res.status(403).send({ message : 'No token provided.'});

  jwt.verify(token, key, (err, decoded) => {
    if (err) return res.status(401).send({ message : 'Failed to authenticate token.'});

    req.body.userId = decoded.id; 
    next();
  });
};
