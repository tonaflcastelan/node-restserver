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
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

/**
 * Token Expires
 */
process.env.EXPIRES = 60 * 60 * 24 * 30;

/**
 * Token Seed
 */
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'dev-evn-token';

/**
 * Google client
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '1050133401345-okma47cnf3n3si3k3d9td3eeqaa9di7c.apps.googleusercontent.com'