const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    original: {
        type: String,
        required: true
    },
    shortened: {
        type: Number,
        required: true
    }
});

exports.urlSchema = url;