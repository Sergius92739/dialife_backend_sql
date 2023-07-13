import pg from 'pg';
import dotenv from "dotenv";
const {Pool} = pg;
dotenv.config()

const pool = new Pool({
  user: 'admin',
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  port: 5432,
  database: 'dialife'
});

export default pool;