const ACL = require('acl');
const mongoose = require('mongoose');
const User = require('../../models/users');

// Use MongoDB as backend
const acl = new ACL(new ACL.mongodbBackend(mongoose.connection.db, 'acl_'));

acl.allow([
  {
    roles: 'admin',
    allows: [
      { resources: '/api/users', permissions: '*' },
      { resources: '/api/content', permissions: '*' }
    ]
  },
  {
    roles: 'learner',
    allows: [
      { resources: '/api/content', permissions: 'get' }
    ]
  },
  {
    roles: 'guest',
    allows: [
      { resources: '/api/content', permissions: 'get' }
    ]
  }
]);

module.exports = acl;
