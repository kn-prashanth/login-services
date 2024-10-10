const app = require('./app');

module.exports = (req, res) => {
  app(req, res);  // Delegate the requests to the Express app
};
