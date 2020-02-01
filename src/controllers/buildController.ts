import { LeagueBuildFunctions, UserFunctions } from '../models';
import { RequestHandler } from 'express';

export const getAllLeagueBuilds: RequestHandler = async (req, res) => {
  try {
    const allBuilds = await LeagueBuildFunctions.getAllBuilds();
    if (allBuilds) {
      return res.status(200).json(allBuilds);
    }
    res.statusMessage = 'No builds found';
    return res.sendStatus(404);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getLeagueBuilds: RequestHandler = async (req, res) => {
  try {
    const { limit } = req.query;
    const builds = await LeagueBuildFunctions.getBuilds(+limit);
    res.status(200).json(builds);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getAllLeagueUserBuilds: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    let token = req.headers.authorization;
    if (id && token) {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const { _id } = await UserFunctions.getTokenUserData(token);
        if (_id) {
          const userLeagueBuilds = await LeagueBuildFunctions.getAllUserBuilds(_id);
          return res.status(200).json(userLeagueBuilds);
        }
        res.statusMessage = 'Could not retreive user data';
        return res.sendStatus(404);
      }
      res.statusMessage = 'Token invalid';
      return res.sendStatus(403);
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllPublicUserBuilds: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const userLeagueBuilds = await LeagueBuildFunctions.getAllUserBuilds(id);
      if (userLeagueBuilds) {
        return res.status(200).json(userLeagueBuilds);
      }
      res.statusMessage = 'User has no builds';
      return res.sendStatus(404);
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const createLeagueBuild: RequestHandler = async (req, res) => {
  try {
    const { items, private: isPrivate } = req.body;
    console.log(items, isPrivate);
    let token = req.headers.authorization;
    if (items && typeof isPrivate === 'boolean') {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const userData = await UserFunctions.getTokenUserData(token);
        const newBuild = await LeagueBuildFunctions.createBuild(userData._id, items, isPrivate);
        return res.status(200).json(newBuild);
      }
      res.statusMessage = 'User not authorized';
      return res.sendStatus(403);
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
