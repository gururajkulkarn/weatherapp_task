const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('./models/User');  // Import the User model

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// POST route for login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'ipgautomotive' && password === 'carmaker') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// User-specific routes
app.get('/api/user/:username', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  res.json(user);
});

app.post('/api/user/:username/cities', async (req, res) => {
  const { username } = req.params;
  const { city } = req.body;

  const user = await User.findOne({ username });
  if (user.favoriteCities.length < 5 && !user.favoriteCities.includes(city)) {
    user.favoriteCities.push(city);
    await user.save();
  }
  res.json(user.favoriteCities);
});

app.delete('/api/user/:username/cities/:city', async (req, res) => {
  const { username, city } = req.params;

  const user = await User.findOne({ username });
  user.favoriteCities = user.favoriteCities.filter(c => c !== city);
  await user.save();
  res.json(user.favoriteCities);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
