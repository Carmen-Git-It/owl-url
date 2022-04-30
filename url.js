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

const createUrl = function(urlString, done) {
    Url.findOne({"original": urlString}, (err, url) => {
        if (err) {  
            // Original string match not found, generate next shortened url
            let nextNumber;
            Url.generateNewShort((err, data) => {
                if (err) {
                    nextNumber = 1;
                } else {
                    nextNumber = data.shortened;
                }
            });
            // Create new url and save in DB
            const newUrl = new Url({"original": urlString, "shortened": nextNumber});
            newUrl.save((err, res) => {
                if (err) {
                    console.log(err);
                    done(err);
                } else {
                    done(res);
                }
            });
        } else {
            // Original string match was found, return existing url
            done(null, url);
        }
    });
}

exports.urlModel = Url;