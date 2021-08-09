import jwt from 'jsonwebtoken';

export default function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET);
    req.uid = decoded.id;
    req.roles = decoded.roles;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
}
