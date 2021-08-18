/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

import Models from '../models/init-models';

const { Profiles, Users } = new Models();

// export async function updateProfile() {}

export async function getProfile(req, res) {
  const requestedProfile = await Profiles.findByPk(req.params.id);
  const user = await Users.findByPk(req.params.id);

  if (!requestedProfile || !user) return res.status(404).json({ message: 'Profile not found' });
  return res.status(200).json({
    id: requestedProfile.id,
    profile_picture: requestedProfile.profile_picture,
    username: user.username,
    name: requestedProfile.name,
    surname: requestedProfile.surname,
    bio: requestedProfile.bio,
    invited_by: requestedProfile.invited_by,
    followed_by: requestedProfile.followed_by,
    follows: requestedProfile.follows,
  });
}

export async function getProfileByUsername(req, res) {
  const user = await Users.findOne({ where: { username: req.params.username } });
  const requestedProfile = await Profiles.findByPk(user.id);

  if (!requestedProfile || !user) return res.status(404).json({ message: 'Profile not found' });
  return res.status(200).json({
    id: requestedProfile.id,
    profile_picture: requestedProfile.profile_picture,
    username: user.username,
    name: requestedProfile.name,
    surname: requestedProfile.surname,
    bio: requestedProfile.bio,
    invited_by: requestedProfile.invited_by,
    followed_by: requestedProfile.followed_by,
    follows: requestedProfile.follows,
  });
}
