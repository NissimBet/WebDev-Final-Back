import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { MONGO_URI, CLIENT_URI } from './config';

import {
  findUser,
  registerUser,
  login,
  verifyUser,
  validateUser,
  getAllLolChampions,
  getAllDotaChampions,
  getAllOWChampions,
  populateChampions,
} from './controllers';

const app = express();

populateChampions();

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const options: cors.CorsOptions = {
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'X-Access-Token',
    'Authorization',
  ],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: CLIENT_URI,
  preflightContinue: false,
};

app.set('port', process.env.PORT);
app.use(cors(options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/register', registerUser);
app.get('/users/validate', validateUser);
app.post('/users/login', login);

app.get('/champs/lol/all', getAllLolChampions);
app.get('/champs/dota/all', getAllDotaChampions);
app.get('/champs/ow/all', getAllOWChampions);

/* DEBUGGING PURPOSES */
app.post('/users/getOne', findUser);
app.post('/users/verify', verifyUser);

app.options('*', cors(options));

export { app };
