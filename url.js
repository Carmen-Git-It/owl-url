const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to server
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
    if (err) {
      console.log(err);
    } else {
      ready = true;
    }
});

// Create url Schema
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

const url = mongoose.model("url", urlSchema);

exports.urlModel = url;