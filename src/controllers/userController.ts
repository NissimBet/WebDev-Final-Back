import { getChampionById } from '.';
import { UserFunctions } from '../models';
import { RequestHandler } from 'express';

function getToken(token: string) {
  return token.replace('Bearer ', '');
}

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (email && password && username) {
      const userWithEmail = await UserFunctions.isEmailInUse(email);

      if (!userWithEmail) {
        // hash password
        const newUser = await UserFunctions.createUser({
          email: email,
          password: password,
          username,
        });
        res.statusMessage = 'User created';
        return res.status(201).json(newUser);
      } else {
        // username / email taken
        res.statusMessage = 'Email Taken';
        return res.sendStatus(409);
      }
    } else {
      res.statusMessage = 'Missing Parameters';
      return res.sendStatus(406);
    }
  } catch (error) {
    console.log(error);
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const userWithEmail = await UserFunctions.isEmailInUse(email);
      if (userWithEmail) {
        // hash password
        const newUser = await UserFunctions.signInUser({
          email: email,
          password: password,
        });
        //console.log(email, password, newUser);
        if (newUser) {
          res.statusMessage = 'Sign in successful';
          return res.status(200).json(newUser);
        } else {
          res.statusMessage = 'User not found';
          return res.sendStatus(404);
        }
      } else {
        res.statusMessage = 'Email seems to not be registered';
        return res.sendStatus(409);
      }
    } else {
      res.statusMessage = 'Missing Parameters';
      return res.sendStatus(406);
    }
  } catch (error) {
    console.log(error);
  }
};

export const validateUser: RequestHandler = async (req, res) => {
  try {
    let token = req.headers.authorization;

    if (token) {
      token = token.replace('Bearer ', '');

      const wasValidated = await UserFunctions.validateUserToken(token);

      if (wasValidated) {
        res.statusMessage = 'User Validated';
        return res.sendStatus(200);
      } else {
        res.statusMessage = 'User not validated';
        return res.sendStatus(403);
      }
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
  }
};

export const getUserData: RequestHandler = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = getToken(token);

      const userData = await UserFunctions.getTokenUserData(token);
      if (userData) {
        const { email, username, favoriteChamps } = userData;
        res.statusMessage = 'fetch successful';
        res.status(200).json({ email, username, favoriteChamps });
      } else {
        res.statusMessage = 'Could not verify token';
        res.sendStatus(403);
      }
    } else {
      res.statusMessage = 'Missing token';
      res.sendStatus(406);
    }
  } catch (error) {
    console.log(error);
  }
};

export const addFavoriteChampion: RequestHandler = async (req, res) => {
  try {
    const { game, champId } = req.body;
    let token = req.headers.authorization;
    token = getToken(token);
    if (game && champId) {
      const isValid = await UserFunctions.validateUserToken(token);
      if (isValid) {
        const champion = await getChampionById(game, champId);
        if (champion) {
          await UserFunctions.addFavoriteChamp(token, game, champion._id);
          return res.sendStatus(200);
        }
        res.statusMessage = 'Champion not found';
        return res.sendStatus(404);
      }
      res.statusMessage = 'User unauthorized';
      return res.sendStatus(403);
    }
    res.statusMessage = 'Missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(504);
  }
};

export const removeFavoriteChampion: RequestHandler = async (req, res) => {
  try {
    const { game, champId } = req.body;

    let token = req.headers.authorization;
    if (game && champId) {
      token = getToken(token);
      const isValid = await UserFunctions.validateUserToken(token);
      if (isValid) {
        const champion = await getChampionById(game, champId);
        if (champion) {
          await UserFunctions.removeFavoriteChamp(token, game, champion._id);
          return res.sendStatus(200);
        }
        res.statusMessage = 'Champion not found';
        return res.sendStatus(404);
      }
      res.statusMessage = 'User not authorized';
      return res.sendStatus(403);
    } else {
      res.statusMessage = 'Missing parameters';
      return res.sendStatus(406);
    }
  } catch (error) {
    console.log(error);
  }
};
