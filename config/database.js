const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create Sequelize instance for MySQL
const sequelize = new Sequelize(
  'tutor_hub',     // database name
  'root',     // username
  'root', // password
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
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
  }
);

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully (MySQL)');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('📊 Database synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB };
