require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

let ready = false;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended:"false"}));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

const Url = require('./url.js').urlModel;
const createUrl = require('./url.js').createUrl;

app.post('/api/shorturl', (req, res, next) => {
  createUrl(req.body.url, (err, data) => {

    if (err) {
      next(err);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
