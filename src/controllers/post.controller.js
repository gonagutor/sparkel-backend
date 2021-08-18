/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
import jwt from 'jsonwebtoken';
import { Op, Sequelize } from 'sequelize';
import Models from '../models/init-models';
import Profiles from '../models/Profiles';

const { Posts, Users } = new Models(); // TODO: Modify models to comply with real database

export async function getSpecificPost(req, res) {
  try {
    const posts = await Posts.findByPk({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: req.params.id, data_uri: { [Op.ne]: null } },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get specified post' });
  }
}

export async function getMostRecentPosts(req, res) {
  try {
    const user = await Users.findByPk(jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET).id);
    const profile = await Profiles.findByPk(user.id);
    const follows = [user.id, profile.invited_by];
    if (profile.follows) follows.push(...profile.follows);
    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: Sequelize.fn('ANY', Sequelize.cast(follows, 'uuid[]')) },
    });

    if (!user || !profile || !posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get lastest posts' });
  }
}

export async function addNewPost(req, res) {
  try {
    const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET);
    // eslint-disable-next-line camelcase
    const { data_uri, caption } = req.body;

    const newPost = await Posts.create({
      data_uri,
      caption,
      posted_by: token.id,
    });
    if (!newPost) throw Error();
    return res.status(200).json(newPost);
  } catch (e) {
    return res.status(400).json({ message: 'Could not create requested post' });
  }
}

export async function deletePost(req, res) {
  try {
    const token = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET);
    const postToRemove = await Posts.findOne({ where: { id: req.params.id } });

    if (!postToRemove) return res.status(404).json({ message: 'Post could not be found' });
    if (postToRemove.posted_by !== token.id) return res.status(401).json({ message: 'You are not allowed to remove this post' });
    postToRemove.destroy();
    return res.status(200).json({ message: 'Removed post successfully' });
  } catch (e) {
    return res.status(400).json({ message: 'Could not delete requested post' });
  }
}

// Posts by id
export async function getPostsById(req, res) {
  try {
    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: req.params.id },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}

export async function getPostsByIdMediaOnly(req, res) {
  try {
    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: req.params.id, data_uri: { [Op.ne]: null } },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}

export async function getPostsByIdTextOnly(req, res) {
  try {
    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: req.params.id, data_uri: { [Op.is]: null } },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}

// Posts by Username
export async function getPostsByUsername(req, res) {
  try {
    const user = await Users.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ message: 'User could not be found' });

    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: user.id },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}

export async function getPostsByUsernameMediaOnly(req, res) {
  try {
    const user = await Users.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ message: 'User could not be found' });

    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: user.id, data_uri: { [Op.ne]: null } },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}

export async function getPostsByUsernameTextOnly(req, res) {
  try {
    const user = await Users.findOne({ where: { username: req.params.username } });
    if (!user) return res.status(404).json({ message: 'User could not be found' });

    const posts = await Posts.findAll({
      limit: 30,
      order: [['posted_on', 'DESC']],
      where: { posted_by: user.id, data_uri: { [Op.is]: null } },
    });

    if (!posts) throw Error();
    return res.status(200).json(posts);
  } catch (e) {
    return res.status(400).json({ message: 'Could not get users posts' });
  }
}
