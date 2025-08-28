const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: (sql, queryObject) => {
    // Log the final query with actual values
    if (queryObject && queryObject.bind) {
      let finalQuery = sql;
      queryObject.bind.forEach((value, index) => {
        const placeholder = `$${index + 1}`;
        const escapedValue = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
        finalQuery = finalQuery.replace(placeholder, escapedValue);
      });
      console.log('🔍 Final Query:', finalQuery);
    } else {
      console.log('🔍 Query:', sql);
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully (SQLite)');
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('📊 Database synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    // Don't exit in development, just warn
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB };