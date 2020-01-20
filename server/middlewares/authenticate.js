const jwt = require('jsonwebtoken');

/* Verify token */
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
}

/* Verify admin */
let verifyAdmin = (req, res, next) => {
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            status: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

/* Verify token img */
let verifyTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                err: {
                    message: 'Token inválido'
                }
            });
        }
        req.user = decoded.user;
        next();
    });   
}

module.exports = {
    verifyToken,
    verifyAdmin,
    verifyTokenImg
}