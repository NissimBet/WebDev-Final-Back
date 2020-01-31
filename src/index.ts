import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { MONGO_URI, CLIENT_URI } from './config';

import {
  registerUser,
  login,
  validateUser,
  getAllLolChampions,
  getAllDotaChampions,
  getAllOWChampions,
  populateChampions,
  getUserData,
  addFavoriteChampion,
  removeFavoriteChampion,
  getAllChamps,
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
app.get('/user/get-data', getUserData);

app.get('/champs/lol/all', getAllLolChampions);
app.get('/champs/dota/all', getAllDotaChampions);
app.get('/champs/ow/all', getAllOWChampions);
app.get('/champs/all', getAllChamps);

app.post('/user/new-favorite-champ', addFavoriteChampion);
app.post('/user/remove-favorite-champ', removeFavoriteChampion);

app.options('*', cors(options));

export { app };
