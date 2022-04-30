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
        required: true,
        unique: true
    },
    shortened: {
        type: Number,
        required: true,
        unique: true
    }
});

urlSchema.statics.generateNewShort = function(callback) {
    this.findOne({}).sort({'shortened': 'desc'}).exec(callback);
}

const Url = mongoose.model("url", urlSchema);

/*
    Searches for the url string in the database.
    If a match is found, send the matched url to the callback.
    If no match is found, generate a new shortened url
    and save in a database.
*/
const createUrl = function(urlString, done) {
    Url.findOne({"original": urlString}, (err, url) => {
        if (err) {  
            console.log(err);
            return done(err, null);
        } else if (url == null) {
            // Original string match not found, generate next shortened url
            let nextNumber = 0;
            Url.generateNewShort((err, data) => {
                if (err) {
                    console.log(err);
                    return done(err, null);
                } else if (data == null) {
                    nextNumber = 1;
                } else {
                    nextNumber = data.shortened + 1;
                    console.log("DATA SHORTENED " + nextNumber);
                }

                const newUrl = new Url({"original": urlString, "shortened": nextNumber});
                newUrl.save((err, res) => {
                    if (err) {
                        console.log(err);
                        return done(err, null);
                    } else {
                        return done(null, res);
                    }
                });
            });
        } else {
            // Original string match was found, return existing url
            return done(null, url);
        }
    });
}

const findUrl = function(urlString, done) {
    Url.findOne({"original": urlString}, (err, url) => {
        if (err) {
            console.log(err);
            done(err, null);
        } else {
            done(null, url);
        }
    });
}

exports.urlModel = Url;
exports.createUrl = createUrl;
exports.findUrl = findUrl;