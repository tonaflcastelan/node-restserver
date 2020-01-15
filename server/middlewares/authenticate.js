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

module.exports = {
    verifyToken,
    verifyAdmin
}