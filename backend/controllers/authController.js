const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { sendWelcomeEmail } = require('../services/emailService');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
      }
    });

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
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    res.status(500).json({ error: `Failed to register user: ${err.message}` });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to login: ${err.message}` });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to fetch user: ${err.message}` });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return res.json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Failed to update user: ${err.message}` });
  }
};
