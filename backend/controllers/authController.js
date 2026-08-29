const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const newUser = new User({
        id: uuidv4(),
        email: email.toLowerCase(),
        password,
        name,
      });

      await newUser.save();

      // Send welcome email asynchronously
      sendWelcomeEmail(newUser.email, newUser.name);

      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      return res.status(201).json({
        token,
        user: userResponse
      });
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: `Failed to register user: ${err.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return res.status(200).json({
        token,
        user: userResponse
      });
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to login: ${err.message}` });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return res.json(userResponse);
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch user: ${err.message}` });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    if ((mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
      const updateData = {};
      if (name) updateData.name = name;
      if (password) updateData.password = password; 

      const user = await User.findOneAndUpdate(
        { id: userId },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return res.json(userResponse);
    } else {
      const { getLastError } = require('../utils/db');
      const err = getLastError();
      return res.status(503).json({ 
        error: `MongoDB not connected. ${err ? err.message : 'Please check your connection settings.'}` 
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to update user: ${err.message}` });
  }
};
