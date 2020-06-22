const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://admin:lobstericecream@lobstericecream-trflp.gcp.mongodb.net/home?retryWrites=true&w=majority')
  .catch((e) => {
    console.error('Connection error', e.message);
  });

const db = mongoose.connection
module.exports = db;
