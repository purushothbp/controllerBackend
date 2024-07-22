const { OAuth2Client } = require('google-auth-library');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const strings = require('../strings.json')

exports.googleLogin = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        userId: uuidv4(),
        email,
        firstName,
        lastName,
        role: 'guest',
      });

      await user.save();
    }

    // Generate JWT token
    const jwt_token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('User UUID:', user.uuid); 

    return res.status(200).json({
      message: 'Login successful',
      user: {
        uuid: user.userId,
        role: user.role,
      },
      token:jwt_token
    });
  } catch (error) {
    console.error('Error in googleLogin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, role: 'guest', userId: uuidv4() });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: {
        uuid: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: {
        uuid: user.userId,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
