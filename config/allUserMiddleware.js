import jwt from 'jsonwebtoken';
const key = process.env.SECRET_KEY
export const verifyAllUserToken = (req, res, next) => {
  const token = req.headers['authorization']
  if (!token){
    return res.status(401).send({ message : 'Token is required'});
  }
  if (!token) return res.status(403).send('No token provided.');
  jwt.verify(token, key, (err, decoded) => {
    if (err) return res.status(401).send('Failed to authenticate token.');
    req.body.id = decoded.id;
    req.body.usertype_name = decoded.usertype_name;
    next();
  });
};
