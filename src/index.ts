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
  getAllLeagueItems,
  getLeagueItem,
  getLastItemBuild,
  getAllDotaItems,
  getDotaItem,
  getAllLeagueUserBuilds,
  getAllPublicUserBuilds,
  getAllLeagueBuilds,
  getLeagueBuilds,
  createLeagueBuild,
  setBuildPrivacy,
  deleteLeagueBuild,
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

// user stuff
app.post('/users/register', registerUser);
app.get('/users/validate', validateUser);
app.post('/users/login', login);
app.get('/user/get-data', getUserData);

// champs stuff
app.get('/champs/lol/all', getAllLolChampions);
app.get('/champs/dota/all', getAllDotaChampions);
app.get('/champs/ow/all', getAllOWChampions);
app.get('/champs/all', getAllChamps);

// favorite champions stuff
app.post('/user/new-favorite-champ', addFavoriteChampion);
app.post('/user/remove-favorite-champ', removeFavoriteChampion);

// league items stuff
app.get('/league/items', getAllLeagueItems);
app.get('/league/items/id/:id', getLeagueItem);
app.get('/league/items/last', getLastItemBuild);

// dota items stuff
app.get('/dota/items', getAllDotaItems);
app.get('/dota/items/id/:id', getDotaItem);

// league builds
app.get('/league/builds/all', getAllLeagueBuilds);
app.get('/league/builds', getLeagueBuilds);
app.get('/league/builds/user', getAllLeagueUserBuilds);
app.get('/league/builds/public/user/:id', getAllPublicUserBuilds);
app.post('/league/builds/new', createLeagueBuild);
app.delete('/league/builds/delete/:buildId', deleteLeagueBuild);
app.put('/league/build/privacy', setBuildPrivacy);

app.options('*', cors(options));

export { app };
