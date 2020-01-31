import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

import { SECRET } from '../config';

mongoose.Promise = global.Promise;

const ChampionSchema = new Schema({
  id: { type: String, set: (num: string | number) => num as string },
  name: String,
});

interface ChampionData {
  id: string;
  name: string;
}

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  favoriteChamps: {
    league: { type: [ChampionSchema] },
    dota: { type: [ChampionSchema] },
    overwatch: { type: [ChampionSchema] },
  },
});

interface UserInterface extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  favoriteChamps: {
    league: Array<ChampionData>;
    dota: Array<ChampionData>;
    overwatch: Array<ChampionData>;
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
    try {
      const status = await User.create({ ...user });
      return status;
    } catch (error) {
      throw Error(error);
    }
  },
  signInUser: async (user: SignUserIn) => {
    try {
      const data = { user: user.email };
      const token = jwt.sign(data, SECRET, {
        expiresIn: 60 * 60 * 3,
      });
      /* const userData = await User.findOne({ ...user });
      await User.updateOne({ _id: userData._id }, { token: token }); */
      return token;
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

      const userData = await User.findOne({ email: user });

      return userData;
    } catch (error) {
      throw Error(error);
    }
  },
  addFavoriteChamp: async (
    token: string,
    game: 'league' | 'overwatch' | 'dota',
    championData: ChampionData
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
        if (oldFavs[game].findIndex(({ id }) => id === championData.id) >= 0) {
          return false;
        } else {
          oldFavs[game].push(championData);

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
        const indexOfChamp = oldFavs[game].findIndex(({ id }) => id == championId);
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
