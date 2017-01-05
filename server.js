'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:server');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(require('./route/auth-router.js'));
app.use(require('./route/gallery-router.js'));
app.use(require('./route/pic-router.js'));
app.use(require('./lib/error-middleware.js'));

const server = module.exports = app.listen(PORT, () => {
  debug('server up:', PORT);
});

server.isRunning = true;
