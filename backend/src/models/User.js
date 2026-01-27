
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    group: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    avatar: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);