const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const apiPort = 8080;
//Import Routers
const categoryRouter = require('./api/categoryRouter.js');
const itemRouter = require('./api/itemRouter.js');
//connected to mongoose through db/index.js
const { getMongoDB, uri } = require('./db');
if (require.main === module) {
  const mongoDB = getMongoDB(uri);
  mongoDB.on('error', console.error.bind(console, 'MongoDB connection error: '));
}

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Word!');
});

app.use('/category', categoryRouter);
app.use('/item', itemRouter);

const server = app.listen(apiPort, () => console.log('Server running on port %s', apiPort));
module.exports = server;
