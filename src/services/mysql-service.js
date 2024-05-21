import mysql from 'mysql2';
import { Kysely, MysqlDialect, sql } from "kysely";

const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;


const dialect = new MysqlDialect({
  pool: mysql.createPool({ 
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.

const mysqlService = new Kysely({
  dialect,
});

export const mySQL = sql;

export const mysqlDisconnect = async () => {};

export default mysqlService;
