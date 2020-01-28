import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

import { SECRET } from '../config';

mongoose.Promise = global.Promise;

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  token: { type: String },
});

interface UserInterface extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  token: string;
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
      const userData = await User.findOne({ ...user });
      await User.updateOne({ _id: userData._id }, { token: token });
      return token;
    } catch (error) {
      throw Error(error);
    }
  },
  findByEmail: async (email: string) => {
    try {
      const status = await User.findOne({ email: email });

      return status;
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
};
