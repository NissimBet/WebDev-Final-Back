import { RequestHandler } from 'express';
import { DotaBuildFunctions, UserFunctions, championfunctions } from '../models';

export const getAllDotaBuilds: RequestHandler = async (req, res) => {
  try {
    const allBuilds = await DotaBuildFunctions.getAllBuilds();
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

export const getDotaBuilds: RequestHandler = async (req, res) => {
  try {
    const { limit } = req.query;
    const builds = await DotaBuildFunctions.getBuilds(+limit);
    res.status(200).json(builds);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export const getAllDotaUserBuilds: RequestHandler = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const { _id } = await UserFunctions.getTokenUserData(token);
        if (_id) {
          const userDotaBuilds = await DotaBuildFunctions.getAllUserBuilds(_id);
          return res.status(200).json(userDotaBuilds);
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

export const getAllDotaPublicUserBuilds: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const userDotaBuilds = await DotaBuildFunctions.getAllUserBuilds(id);
      if (userDotaBuilds) {
        return res.status(200).json(userDotaBuilds);
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

export const createDotaBuild: RequestHandler = async (req, res) => {
  try {
    const { items, private: isPrivate, champion } = req.body;

    let token = req.headers.authorization;
    if (items && champion && (champion as number) && typeof isPrivate === 'boolean') {
      const championId = await championfunctions.getDotaChampionById(champion);
      if (championId) {
        token = token.replace('Bearer ', '');
        if (token && (await UserFunctions.validateUserToken(token))) {
          const userData = await UserFunctions.getTokenUserData(token);
          const newBuild = await DotaBuildFunctions.createBuild(
            userData._id,
            items,
            isPrivate,
            championId._id
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

export const setDotaBuildPrivacy: RequestHandler = async (req, res) => {
  try {
    const { private: isPrivate, buildId } = req.body;
    let token = req.headers.authorization;
    if (buildId && typeof isPrivate === 'boolean') {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const success = await DotaBuildFunctions.setBuildPrivacy(buildId, isPrivate);
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

export const deleteDotaBuild: RequestHandler = async (req, res) => {
  try {
    const { buildId } = req.params;
    console.log(buildId);
    let token = req.headers.authorization || '';
    if (buildId) {
      token = token.replace('Bearer ', '');
      if (token && (await UserFunctions.validateUserToken(token))) {
        const success = await DotaBuildFunctions.deleteBuild(buildId);
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
