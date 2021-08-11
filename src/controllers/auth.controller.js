/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Console from 'console';
import Models from '../models/init-models';
import { comparePassword, encryptPassword } from '../libs/password';
import generateVerificationToken from '../libs/verificationCodes';
import '../mails/mailer';

const {
  Users, InviteCodes, Profiles, VerificationCodes,
} = new Models();

/**
 * The system shown here is flawed and I will probably rework it once I learn how OAuth2.0 works.
 * This is valid for development purposes but some clear flaws are:
 *  - If the user resets their password their old token will be valid until it expires.
 */

/**
 * This method generates a new Access token.
 * Tokens are valid for 15 days.
 * @param {Request} req Express request object
 * @param {Response} res Express response object
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
    if (!await comparePassword(req.body.password, registeredUser.password)) throw Error('User not found or bad credentials');
    if (!registeredUser.roles.includes('validated')) {
      res.status(401).json({ message: 'Your account is not verified. Check your email' });
      return;
    } // Notify user to verify their account

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
 * @param {Request} req Express request object
 * @param {Response} res Express response object
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
    const verificationCode = await VerificationCodes.create({
      id: newUser.id,
      code: generateVerificationToken(60),
    }); // TODO: Email generated code to user as link

    if (newUser) {
      if (!newProfile || !verificationCode) {
        res.status(500).json({ message: 'Server side error. Please inform a developer' });
        newUser.destroy();
        newProfile.destroy();
        verificationCode.destroy();
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
 * @param {Request} req Express request object
 * @param {Response} res Express response object
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
 * Validate an user
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 */
export async function validateUser(req, res) {
  try {
    const { token } = req.query;
    const verificationCode = await VerificationCodes.findOne({ where: { code: token } });
    const isCodeOutdated = moment(verificationCode.generated_on).add(15, 'minutes') >= moment.utc();
    if (!verificationCode || isCodeOutdated) {
      if (isCodeOutdated) verificationCode.destroy();
      throw Error();
    }
    const user = await Users.findByPk(verificationCode.id);

    if (user.roles.includes('validated')) {
      verificationCode.destroy();
      throw Error();
    }
    user.set('roles', ['user', 'validated']);
    await user.save();
    verificationCode.destroy();
    res.status(200).json({ message: 'Verified successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Malformed or expired token' });
  }
}

/**
 * Regenerate validation code
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 */
export async function regenerateValidationToken(req, res) {
  try {
    let registeredUser;
    const { username, email, password } = req.body;

    if (!username && email && password) {
      registeredUser = await Users.findOne({ where: { email } });
    } else if (!email && username && password) {
      registeredUser = await Users.findOne({ where: { username } });
    } else throw Error('Must provide user and password or email and password');

    if (registeredUser == null) throw Error('User not found or bad credentials');
    if (registeredUser.roles.includes('validated')) {
      res.status(400).json({ message: 'User is already validated' });
      return;
    }
    if (!await comparePassword(req.body.password, registeredUser.password)) throw Error('User not found or bad credentials');
    const lastValidationToken = await VerificationCodes.findOne({
      where: { id: registeredUser.id },
    });
    if (lastValidationToken) await lastValidationToken.destroy();
    await VerificationCodes.create({
      id: registeredUser.id,
      code: generateVerificationToken(60),
    }); // TODO: Send code via email

    res.status(200).json({ message: 'Verification code recreated' });
  } catch (e) {
    res.status(400).json({ message: 'Request malformed' });
  }
}

/**
 * This method generates a new invite code using a function implemented on PostgreSQL that generates
 * a random string six character long.
 * @param {Request} req Express request object
 * @param {Response} res Express response object
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
