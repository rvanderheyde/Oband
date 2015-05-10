var mongoose = require('mongoose');

var exports = {};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});

// defining schema for users
var userSchema = mongoose.Schema({
  name: String
});

exports.User = mongoose.model('User', userSchema);

var songSchema = mongoose.Schema({
  title: String,
  data: []
});

exports.Song = mongoose.model('Song', songSchema);

// defining schema for leaderboard
var leaderSchema = mongoose.Schema({
  score: Number,
  user: String,
  song: String,
  user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  song_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Song'}
});

exports.Leader = mongoose.model('Leader', leaderSchema);

module.exports = exports;