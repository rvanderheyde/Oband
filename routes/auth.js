var passport = require('passport');
var schema = require('./../models/schema.js');
var User = schema.User;

var exports = {};

// Function to authenticate new user from facebook
exports.auth = function(req, res) {
  if (Object.keys(req.session.passport).length !== 0) {
    var name = req.session.passport.user.displayName;
    User.findOne({name: name})
      .exec(function (err, user) {
        if (err) {
          console.log('findOne query failed');
        } else if (!user) {
          // Add new user to db if user does not yet exist
          var user = new User({
            name: name,
          });
          // Save new user
          user.save(function (err) {
            if (err) {
              console.log('Problem saving user', err);
            }
            // save current user_id
            req.session.userid = user._id;
            // Redirect to home page
            res.redirect('/');
          });
        } else {
          // save current user_id
          req.session.userid = user._id;
          // Redirect to home page
          res.redirect('/');
        }
      });
  }
};

exports.login = function(req, res) {
  User.find({}).exec(function (err, users) {
    if (err) {
      console.log('Cant find any users :(');
    } else {
      res.send('login');
    }
  })
}

// Called by client when logging out to get rid of user credentials from session
exports.loggingOut = function(req, res) {
  req.session.passport = {};
  req.session.userid = '';

  // redirect client to home page (to log them out)
  res.send('.');
};

module.exports = exports;