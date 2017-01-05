'use strict';

const expect = require('chai').expect;
const request = require('superagent');

const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const User = require('../model/user.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('Auth Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });
  
  describe('POST /api/signup', function() {
    describe('with a valid body', function() {
      after(done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end( (err, res) => {
          if(err) return done(err);
          console.log('token:', res.text);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    }); // valid body
  }); // POST /api/signup

  describe('GET /api/signin', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        });
      });

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth(exampleUser.username, exampleUser.password)
        .end( (err, res) => {
          if(err) return done(err);
          // console.log('user:', this.tempUser); //This creates an error!?!
          console.log('token:', res.text);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    }); // valid body
  }); // GET /api/signin
});
