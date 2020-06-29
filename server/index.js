const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const apiPort = 8080;

//connected to mongoose through db/index.js
const getDB, URI = require('./db');
const db = getDB(URI);
//Import Routers
const categoryRouter = require('./api/categoryRouter.js');
const itemRouter = require('./api/itemRouter.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.get('/', (req, res) => {
  res.send('Hello Word!');
});

app.use('/category', categoryRouter);
//app.use('/item', itemRouter);

app.listen(apiPort, () => console.log('Server running on port ', apiPort));
