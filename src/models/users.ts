import mongoose, { Schema } from 'mongoose';
import { JWT, JWK } from 'jose';

import { SECRET } from '../config';

mongoose.Promise = global.Promise;

const userJWTKey = JWK.asKey({
  kty: 'oct',
  k: SECRET,
});

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
      const token = JWT.sign({ username: `${user.email}${user.password}` }, userJWTKey, {
        issuer: 'gamemonitor',
        expiresIn: '2 hours',
        header: {
          typ: 'JWT',
        },
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
  validateUserToken: async (email: string, token: string) => {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return JWT.verify(token, userJWTKey, {
          issuer: 'gamemonitor',
        });
      }
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
