var mongoose = require('mongoose');

var exports = {};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});
exports.db = db;

// defining schema for users
var userSchema = mongoose.Schema({
  name: String,
  songs: [String],
  scores: [Number]
});

exports.User = mongoose.model('User', userSchema);

var songSchema = mongoose.Schema({
  title: String,
  data: [{time: Number, keys: [String]}]
});

exports.Song = mongoose.model('Song', songSchema);

// defining schema for leaderboard
var leaderSchema = mongoose.Schema({
  score: Number,
  user: String,
  song: String,
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

exports.Leader = mongoose.model('Leader', leaderSchema);

module.exports = exports;