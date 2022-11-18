const mongoose = require('mongoose');

const platformSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
});

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    platforms: {
        type: [platformSchema],
        default: []
    }
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

mongoose.model(process.env.GAME_MODEL, gameSchema, process.env.GAMES_COLLECTION);
mongoose.model(process.env.USER_MODEL, userSchema, process.env.USERS_COLLECTION);