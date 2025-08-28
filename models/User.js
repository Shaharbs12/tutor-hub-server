const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  userType: {
    type: DataTypes.ENUM('student', 'tutor', 'admin'),
    allowNull: false,
    field: 'user_type'
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'subject_id'
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'profile_image'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_admin'
  },
  languagePreference: {
    type: DataTypes.ENUM('en', 'he'),
    defaultValue: 'en',
    field: 'language_preference'
  }
}, {
  tableName: 'users',
  hooks: {
    // beforeCreate: async (user) => {
    //   if (user.passwordHash) {
    //     // const salt = await bcrypt.genSalt(10);
    //     console.log(user.passwordHash);
    //     user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    //   }
    // },
    // beforeUpdate: async (user) => {
    //   if (user.changed('passwordHash')) {
    //     const salt = await bcrypt.genSalt(10);
    //     user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
    //   }
    // }
  }
});

// Instance methods
User.prototype.comparePassword = async function(password) {
  return password == this.passwordHash;
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.passwordHash;
  return values;
};

module.exports = User;