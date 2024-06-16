/* import UrlPattern from "url-pattern"
import { decodeAccessToken } from "../utils/jwt.js"
import { sendError } from "h3"
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export default defineEventHandler(async (event) => {
    const endpoints = [
        '/api/auth/user',
        '/api/user/tweets',
        '/api/tweets',
        '/api/tweets/:id'
    ];

    const isHandledByThisMiddleware = endpoints.some(endpoint => {
        const pattern = new UrlPattern(endpoint);
        return pattern.match(event.req.url);
    });

    if (!isHandledByThisMiddleware) {
        return;
    }

    const token = event.req.headers['authorization']?.split(' ')[1];

    const decoded = decodeAccessToken(token);

    if (!decoded) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        }));
    }

    try {
        const userId = decoded.userId;

        // Fetch user from MySQL database
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user) {
            return sendError(event, createError({
                statusCode: 404,
                statusMessage: 'User not found'
            }));
        }

        event.context.auth = { user };
    } catch (error) {
        console.error(error);
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error'
        }));
    }
}); */