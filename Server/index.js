const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes/userRoute');
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors()); 
app.use(express.json()); 
app.use('/', router);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@back-prac-2-admin.sldkkq5.mongodb.net/house_hunter?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
