const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

app.use(bodyParser.json())

app.use('/auth', authRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(result => {
    app.listen(process.env.PORT || 3000, () => { 
      console.log("Connected!!!!!!!!!!!!!!!!!!!!")
     });
  })
  .catch(err => console.log(err.message));
