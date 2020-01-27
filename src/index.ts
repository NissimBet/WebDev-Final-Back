import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { MONGO_URI } from './config';

import { findUser, registerUser, signIn, verifyUser, validateUser } from './controllers';

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
    res.send(204);
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/getOne', findUser);
app.post('/users/register', registerUser);
app.get('/users/validate/', validateUser);

/* DEBUGGING PURPOSES */
app.post('/users/signIn', signIn);
app.post('/users/verify', verifyUser);

export { app };
