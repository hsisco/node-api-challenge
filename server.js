const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const server = express();

const actionRouter = require('./routes/actionRouter');
const projectRouter = require('./routes/projectRouter');

server.use(express.json(), helmet(), morgan('dev'), logger);

server.use('/actions', actionRouter);
server.use('/projects', projectRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Hysen's Attempt at Backend 🥴</h2>`);
});

function logger(req, res, next) {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date();

  console.log(`A ${method} request to ${url} occurred at ${timestamp}.`);
  next();
}

module.exports = server;