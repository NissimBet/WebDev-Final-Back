import { UserFunctions } from '../models';
import { RequestHandler } from 'express';

// TODO do I validate token alongside email?

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (email && password && username) {
      const userWithEmail = await UserFunctions.findByEmail(email);

      if (!userWithEmail) {
        // hash password
        const newUser = await UserFunctions.createUser({
          email: email,
          password: password,
          username,
        });

        return res.status(201).json(newUser);
      } else {
        // username / email taken
        res.statusMessage = 'Email taken';
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
      const userWithEmail = await UserFunctions.findByEmail(email);
      if (userWithEmail) {
        // hash password
        const newUser = await UserFunctions.signInUser({
          email: email,
          password: password,
        });

        return res.status(200).json(newUser);
      } else {
        // username / email taken
        res.statusMessage = 'Email taken';
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

/* FOR DEBUGGING PURPOSES */
export const findUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserFunctions.findByEmail(email);

    return res.sendStatus(200).json(user);
  } catch (error) {
    console.log(error);
  }
};
/* USED IN DEBUGGING */
export const verifyUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserFunctions.findByEmail(email);
    if (user) {
      const token = await UserFunctions.signInUser({ email: email, password: password });
      const isToken = await UserFunctions.validateUserToken(token);

      return res.sendStatus(200).json(isToken);
    } else {
      res.statusMessage = 'user not found';
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
};
