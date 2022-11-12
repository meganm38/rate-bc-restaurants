import { Sequelize } from 'sequelize';

import * as dotenv from 'dotenv'
dotenv.config({path:  './db.env'})

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      dialect: "postgres",
      pool: {
        max: 10,
        min: 0,
        idle: 30000
      },
      define: {
        timestamps: false
      },
      dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
    }
  );

export default sequelize;