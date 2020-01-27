import { UserFunctions } from '../models';
import { RequestHandler } from 'express';

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

        res.status(200).json(newUser);
      } else {
        // username / email taken
        res.statusMessage = 'Email taken';
        res.status(409).send();
      }
    } else {
      res.statusMessage = 'Missing Parameters';
      res.status(406).send();
    }
  } catch (error) {
    console.log(error);
  }
};

export const signIn: RequestHandler = async (req, res) => {
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
        console.log(newUser);

        res.status(200).json(newUser);
      } else {
        // username / email taken
        res.statusMessage = 'Email taken';
        res.status(409).send();
      }
    } else {
      res.statusMessage = 'Missing Parameters';
      res.status(406).send();
    }
  } catch (error) {
    console.log(error);
  }
};

export const validateUser: RequestHandler = async (req, res) => {
  try {
    const { email, token } = req.query;
    if (email && token) {
      const wasValidated = await UserFunctions.validateUserToken(email, token);
      if (wasValidated) {
        res.statusMessage = 'User Validated';
        return res.status(201).send(wasValidated);
      } else {
        res.statusMessage = 'User not validated';
        return res.status(404).send();
      }
    }
    res.statusMessage = 'Missing parameters';
    res.status(409).send();
  } catch (error) {
    console.log(error);
  }
};

/* FOR DEBUGGING PURPOSES */
export const findUser: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserFunctions.findByEmail(email);
    console.log(user);
    res.status(200).json(user);
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
      const isToken = await UserFunctions.validateUserToken(email, token);

      console.log(isToken);
      return res.status(200).send(isToken);
    } else {
      res.statusMessage = 'user not found';
      res.status(404).send();
    }
  } catch (error) {
    console.log(error);
  }
};
