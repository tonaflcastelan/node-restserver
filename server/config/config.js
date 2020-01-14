/**
 * Port
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * Enviroment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * DataBase
 */
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://node-mongo-db:2apuW5yXJidrXQkL@cluster0-nq3je.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;