'use strict';

const AWS = require('aws-sdk-mock');

module.exports = exports = {};

exports.uploadMock = {
  ETag: '1234abcd',
  Location: 'http://mockurl.com/mock.png',
  Key: 'mock.png',
  key: 'mock.png',
  Bucket: 'gws-cfgram'
};

AWS.mock('S3', 'upload', function(params, callback) {
  console.log('MOCK S3 Called');

  if(params.ACL !== 'public-read') {
    return callback(new Error('ACL must be public-read'));
  }
  if(params.Bucket !== 'gws-cfgram') {
    return callback(new Error('Bucket must be gws-cfgram'));
  }

  if(!params.Key) {
    return callback(new Error('Key required'));
  }

  if(!params.Body) {
    return callback(new Error('Body required'));
  }

  return callback(null, exports.uploadMock);
});
