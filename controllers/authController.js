const jwt = require('jsonwebtoken');
const { User, Tutor, Student } = require('../models');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      userType,
      phone,
      city,
      languagePreference
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      email,
      passwordHash: password, // Will be hashed by the hook
      firstName,
      lastName,
      userType,
      phone,
      city,
      languagePreference: languagePreference || 'en'
    });

    // Create profile based on user type
    if (userType === 'tutor') {
      await Tutor.create({ userId: user.id });
    } else if (userType === 'student') {
      await Student.create({ userId: user.id });
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        languagePreference: user.languagePreference
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        isAdmin: user.isAdmin,
        languagePreference: user.languagePreference,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    // Get user profile based on type
    if (user.userType === 'tutor') {
      profile = await Tutor.findOne({
        where: { userId: user.id },
        include: [{ model: require('../models/Subject'), as: 'subjects' }]
      });
    } else if (user.userType === 'student') {
      profile = await Student.findOne({ where: { userId: user.id } });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        phone: user.phone,
        city: user.city,
        profileImage: user.profileImage,
        languagePreference: user.languagePreference,
        profile
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.email;
    delete updates.password;
    delete updates.userType;

    await User.update(updates, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile
};