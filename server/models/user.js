const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValues = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido',
};

/**
 * Init mongoose schema
 */
let Schema = mongoose.Schema;

/**
 * Schema for user model
 */
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La constraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValues
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});
module.exports = mongoose.model('User', userSchema)