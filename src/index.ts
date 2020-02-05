import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import { MONGO_URI, CLIENT_URI } from './config';

import {
  ChampionController,
  DotaBuildController,
  DotaController,
  LeagueBuildController,
  LeagueController,
  UserController,
} from './controllers';

const app = express();

ChampionController.populateChampions();

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
app.post('/users/register', UserController.registerUser);
app.get('/users/validate', UserController.validateUser);
app.post('/users/login', UserController.login);
app.get('/user/get-data', UserController.getUserData);

// champs stuff
app.get('/champs/lol/all', ChampionController.getAllLolChampions);
app.get('/champs/dota/all', ChampionController.getAllDotaChampions);
app.get('/champs/ow/all', ChampionController.getAllOWChampions);
app.get('/champs/all', ChampionController.getAllChamps);

// favorite champions stuff
app.post('/user/new-favorite-champ', UserController.addFavoriteChampion);
app.post('/user/remove-favorite-champ', UserController.removeFavoriteChampion);

// league items stuff
app.get('/league/items', LeagueController.getAllLeagueItems);
app.get('/league/items/id/:id', LeagueController.getLeagueItem);
app.get('/league/items/last', LeagueController.getLastItemBuild);

// dota items stuff
app.get('/dota/items', DotaController.getAllDotaItems);
app.get('/dota/items/id/:id', DotaController.getDotaItem);

// league builds
app.get('/league/builds/all', LeagueBuildController.getAllLeagueBuilds);
app.get('/league/builds', LeagueBuildController.getLeagueBuilds);
app.get('/league/builds/user', LeagueBuildController.getAllLeagueUserBuilds);
app.get('/league/builds/public/user/:id', LeagueBuildController.getAllLeaguePublicUserBuilds);
app.post('/league/builds/new', LeagueBuildController.createLeagueBuild);
app.delete('/league/builds/delete/:buildId', LeagueBuildController.deleteLeagueBuild);
app.put('/league/build/privacy', LeagueBuildController.setLeagueBuildPrivacy);

// dota builds
app.get('/dota/builds/all', DotaBuildController.getAllDotaBuilds);
app.get('/dota/builds', DotaBuildController.getDotaBuilds);
app.get('/dota/builds/user', DotaBuildController.getAllDotaUserBuilds);
app.get('/dota/builds/public/user/:id', DotaBuildController.getAllDotaPublicUserBuilds);
app.post('/dota/builds/new', DotaBuildController.createDotaBuild);
app.delete('/dota/builds/delete/:buildId', DotaBuildController.deleteDotaBuild);
app.put('/dota/build/privacy', DotaBuildController.setDotaBuildPrivacy);

app.options('*', cors(options));

export { app };
