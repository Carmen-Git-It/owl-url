require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

let ready = false;

// Basic Configuration
const port = process.env.PORT || 3000;

// Connect to server
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
  if (err) {
    console.log(err);
  } else {
    ready = true;
  }
});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const urlSchema = require('./urlSchema.js').urlSchema;



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
