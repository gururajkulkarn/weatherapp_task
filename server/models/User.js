// models/User.js
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  favoriteCities: { type: [String], default: [] },
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
