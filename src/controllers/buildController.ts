import { LeagueBuildFunctions, UserFunctions, championfunctions } from '../models';
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
    let token = req.headers.authorization;
    if (token) {
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
    const { items, private: isPrivate, champion } = req.body;

    let token = req.headers.authorization;
    if (items && champion && typeof isPrivate === 'boolean') {
      const championId = await championfunctions.getLeagueChampionById(champion);
      if (championId) {
        token = token.replace('Bearer ', '');
        if (token && (await UserFunctions.validateUserToken(token))) {
          const userData = await UserFunctions.getTokenUserData(token);
          const newBuild = await LeagueBuildFunctions.createBuild(
            userData._id,
            items,
            isPrivate,
            championId
          );
          return res.status(200).json(newBuild);
        }
        res.statusMessage = 'User not authorized';
        return res.sendStatus(403);
      }
      res.statusMessage = 'Champion not found';
      return res.sendStatus(404);
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const setBuildPrivacy: RequestHandler = async (req, res) => {
  try {
    const { private: isPrivate, buildId } = req.body;
    let token = req.headers.authorization;
    if (buildId && typeof isPrivate === 'boolean') {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const success = await LeagueBuildFunctions.setBuildPrivacy(buildId, isPrivate);
        if (success) {
          return res.sendStatus(200);
        } else {
          res.statusMessage = 'Build not found';
          return res.sendStatus(404);
        }
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

export const deleteLeagueBuild: RequestHandler = async (req, res) => {
  try {
    const { buildId } = req.params;
    console.log(buildId);
    let token = req.headers.authorization || '';
    if (buildId) {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const success = await LeagueBuildFunctions.deleteBuild(buildId);
        if (success) {
          return res.sendStatus(204);
        } else {
          res.statusMessage = 'Build not found';
          return res.sendStatus(404);
        }
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
