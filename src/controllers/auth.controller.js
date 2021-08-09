import jwt from 'jsonwebtoken';
import moment from 'moment';
import Console from 'console';
import Models from '../models/init-models';
import { comparePassword, encryptPassword } from '../libs/password';

const { Users, InviteCodes, Profiles } = new Models();

/**
 * This method generates a new Access token.
 * Tokens are valid for 15 days.
 * @param {import("express").Request} req Express request object
 * @param {import("express").Response} res Express response object
 */
export async function login(req, res) {
  try {
    let registeredUser;
    const { username, email, password } = req.body;

    if (!username && email && password) {
      registeredUser = await Users.findOne({ where: { email } });
    } else if (!email && username && password) {
      registeredUser = await Users.findOne({ where: { username } });
    } else throw Error('Must provide user and password or email and password');

    if (registeredUser == null) throw Error('User not found or bad credentials');
    if (await comparePassword(req.body.password, registeredUser.password)) throw Error('User not found or bad credentials');
    if (registeredUser.roles.includes('unverified')) throw Error('This user is not verified'); // Notify user to verify their account

    res.status(200).json({
      token: jwt.sign({
        id: registeredUser.id,
        roles: registeredUser.roles,
      }, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 15 }),
    });
  } catch (e) {
    res.status(400).json({ message: 'Request malformed' });
  }
}

/**
 * This method registers a new user checking that the code used is valid. No roles are provided
 * therefore validation is needeed to access other routes
 * @param {import("express").Request} req Express request object
 * @param {import("express").Response} res Express response object
 */
export async function register(req, res) {
  try {
    const {
      username, email, password, name, surname, inviteCode,
    } = req.body;

    const code = await InviteCodes.findOne({ where: { code: inviteCode } });
    const isCodeOutdated = code.valid_until <= moment.now();
    if (!code || isCodeOutdated) {
      if (isCodeOutdated) code.destroy();
      res.status(401).send({ message: 'Invalid invite code' });
      return;
    }

    const newUser = await Users.create({
      username,
      password: await encryptPassword(password),
      email,
      roles: [],
    });
    const newProfile = await Profiles.create({
      id: newUser.id,
      name,
      surname,
      invited_by: code.generated_by,
    });

    if (newUser) {
      if (!newProfile) {
        res.status(500).json({ message: 'Server side error. Please inform a developer' });
        newUser.destroy();
        newProfile.destroy();
        return;
      }
      res.status(200).json({ message: 'User created successfully' });
      code.destroy();
    }
  } catch (error) {
    res.status(400).json({ message: 'Request malformed' });
  }
}

/**
 * This allows user with administrator privileges (Checked in middleware) to create users without a
 * code and with already specified roles
 * @param {import("express").Request} req Express request object
 * @param {import("express").Response} res Express response object
 */
export async function registerElevatedUser(req, res) {
  try {
    const { uid } = req; // User id value is added to req on token validation (middleware)
    const {
      username, email, password, name, surname, roles,
    } = req.body;

    const newUser = await Users.create({
      username,
      password: await encryptPassword(password),
      email,
      roles,
    });
    const newProfile = await Profiles.create({
      id: newUser.id,
      name,
      surname,
      invited_by: uid,
    });

    if (newUser) {
      if (!newProfile) {
        res.status(500).json({ message: 'Server side error. Please inform a developer' });
        newUser.destroy();
        newProfile.destroy();
        return;
      }
      Console.log(`[\x1b[33mWarning\x1b[0m] New elevated user created (Roles: ${roles})`);
      res.status(200).json({ message: 'User created successfully' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Request malformed' });
  }
}

/**
 * This method generates a new invite code using a function implemented on PostgreSQL that generates
 * a random string six character long.
 * @param {import("express").Request} req Express request object
 * @param {import("express").Response} res Express response object
 */
export async function generateInviteCode(req, res) {
  try {
    const { uid } = req; // User id value is added to req on token validation (middleware)
    const code = await InviteCodes.create({ generated_by: uid });

    if (!code) throw Error();
    res.status(200).json({
      code: code.code,
      generatedOn: code.generated_on,
      validUntil: code.valid_until,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
