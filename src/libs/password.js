import bcrypt from 'bcrypt';

export async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, receivedPassword) {
  return bcrypt.compare(password, receivedPassword);
}
