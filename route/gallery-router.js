'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const router = module.exports = new Router();

router.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/gallery');

  req.body.userId = req.user._id;
  new Gallery(req.body).save()
  .then( gallery => res.json(gallery))
  .catch(next);
});

router.get('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('GET /api/gallery/:id', req.params.id);

  Gallery.findById(req.params.id)
  .then( gallery => {
    if(gallery.userId.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    }
    res.json(gallery);
  })
  .catch( err => next(createError(404, err.message)));
});
