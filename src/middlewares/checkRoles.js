import jwt from 'jsonwebtoken';

function isRole(req, res, next, role) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const { roles } = jwt.verify(token.split(' ')[1], process.env.SECRET);
    if (roles.includes(role)) return next();
    return res.status(401).json({ message: 'Unauthorized!' });
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
}

export const isAdmin = (req, res, next) => isRole(req, res, next, 'administrator');
export const isModerator = (req, res, next) => isRole(req, res, next, 'moderator');
export const isUser = (req, res, next) => isRole(req, res, next, 'user');
export const isValidated = (req, res, next) => isRole(req, res, next, 'validated');
// TODO: Add email, username, and other checks needed for registration
