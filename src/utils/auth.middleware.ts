import * as jwt from 'jsonwebtoken';
import { config } from '../config/auth.config';

export const verifyToken = (req, res, next) => {
  const [bearer, token] = req.headers['authorization'].split(' ');

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decodedUser = jwt.verify(token, config.secret);
    req.user = decodedUser;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
  return next();
};
