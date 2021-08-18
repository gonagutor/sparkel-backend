import jwt from 'jsonwebtoken';

function checkThemself(req, res, next) {
  const token = req.headers.authorization;
  const { id } = req.params;
  if (!token) return res.status(403).json({ message: 'No token provided' });
  try {
    const { jwtId } = jwt.verify(token.split(' ')[1], process.env.SECRET);
    if (id === jwtId) return next();
    return res.status(401).json({ message: 'Unauthorized!' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
}

export default checkThemself;
