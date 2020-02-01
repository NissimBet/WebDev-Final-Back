import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

import { SECRET } from '../config';
import { SHA256 } from 'crypto-js';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  favoriteChamps: {
    league: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'league-champions' }],
    },
    dota: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'dota-champions' }],
    },
    overwatch: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'overwatch-champions' }],
    },
  },
});

interface UserInterface extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  favoriteChamps: {
    league: Array<string>;
    dota: Array<string>;
    overwatch: Array<string>;
  };
}

const User = mongoose.model<UserInterface>('users', UserSchema);

interface CreateUserInterface {
  username: string;
  email: string;
  password: string;
}

interface SignUserIn {
  email: string;
  password: string;
}

export const UserFunctions = {
  createUser: async (user: CreateUserInterface) => {
    const { password } = user;
    const encryptedPass = SHA256(password, SECRET);
    try {
      const status = await User.create({
        email: user.email,
        username: user.username,
        password: encryptedPass,
      });
      return status;
    } catch (error) {
      throw Error(error);
    }
  },
  signInUser: async (user: SignUserIn) => {
    try {
      const encryptedPass = SHA256(user.password, SECRET);
      // console.log(user.password, encryptedPass.toString());
      const isUser = await User.findOne({
        email: user.email,
        password: encryptedPass.toString(),
      });
      if (isUser) {
        const data = { user: user.email };
        const token = jwt.sign(data, SECRET, {
          expiresIn: 60 * 60 * 3,
        });
        return token;
      } else {
        return null;
      }
    } catch (error) {
      throw Error(error);
    }
  },
  validateUserToken: async (token: string) => {
    try {
      let wasVerified = false;
      jwt.verify(token, SECRET, (err, _) => {
        if (err) {
          wasVerified = false;
          return;
        }
        wasVerified = true;
        return;
      });

      return wasVerified;
    } catch (error) {
      throw Error(error);
    }
  },
  isEmailInUse: async (email: string) => {
    try {
      const user = await User.findOne({ email: email });
      return !!user;
    } catch (error) {
      throw Error(error);
    }
  },
  getTokenUserData: async (token: string) => {
    try {
      let tokenData;
      jwt.verify(token, SECRET, (err, data) => {
        if (err) {
          tokenData = null;
          return;
        }
        tokenData = data;
      });

      if (!tokenData) {
        return tokenData;
      }

      const { user } = tokenData;

      const userData = await User.findOne({ email: user })
        .populate('favoriteChamps.league')
        .populate('favoriteChamps.dota')
        .populate('favoriteChamps.overwatch');

      return userData;
    } catch (error) {
      throw Error(error);
    }
  },
  addFavoriteChamp: async (
    token: string,
    game: 'league' | 'overwatch' | 'dota',
    championId: string
  ) => {
    try {
      let tokenData;
      jwt.verify(token, SECRET, (err, data) => {
        if (err) {
          tokenData = null;
          return;
        }
        tokenData = data;
      });

      if (!tokenData) {
        return false;
      }

      const { user } = tokenData;

      const userToUpdate = await User.findOne({ email: user });
      if (userToUpdate) {
        const oldFavs = userToUpdate.favoriteChamps;
        if (oldFavs[game].findIndex(id => id === championId) >= 0) {
          return false;
        } else {
          oldFavs[game].push(championId);

          await User.updateOne({ email: user }, { favoriteChamps: oldFavs });
          return true;
        }
      }
    } catch (error) {
      throw Error(error);
    }
  },
  removeFavoriteChamp: async (
    token: string,
    game: 'league' | 'overwatch' | 'dota',
    championId: string | number
  ) => {
    try {
      let tokenData;
      jwt.verify(token, SECRET, (err, data) => {
        if (err) {
          tokenData = null;
          return;
        }
        tokenData = data;
      });

      if (!tokenData) {
        return false;
      }

      const { user } = tokenData;

      const userToUpdate = await User.findOne({ email: user });
      if (userToUpdate) {
        const oldFavs = userToUpdate.favoriteChamps;
        const indexOfChamp = oldFavs[game].findIndex(id => id == championId);
        if (indexOfChamp < 0) {
          return false;
        } else {
          oldFavs[game].splice(indexOfChamp, 1);

          await User.updateOne({ email: user }, { favoriteChamps: oldFavs });
          return true;
        }
      }
    } catch (error) {
      throw Error(error);
    }
  },
};
