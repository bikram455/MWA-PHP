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

mongoose.model(process.env.GAME_MODEL, gameSchema, process.env.GAMES_COLLECTION);