import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { MONGO_URI } from './config';

import {
  findUser,
  registerUser,
  login,
  verifyUser,
  validateUser,
  getAllLolChampions,
  getAllDotaChampions,
  getAllOWChampions,
} from './controllers';

const app = express();

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.set('port', process.env.PORT);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/register', registerUser);
app.get('/users/no-email-validate', validateUser);
app.post('/users/login', login);

app.get('/champs/lol/all', getAllLolChampions);
app.get('/champs/dota/all', getAllDotaChampions);
app.get('/champs/ow/all', getAllOWChampions);

/* DEBUGGING PURPOSES */
app.post('/users/getOne', findUser);
app.post('/users/verify', verifyUser);

export { app };
