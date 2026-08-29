try {
  const app = require('../backend/server.js');
  module.exports = app;
} catch (error) {
  module.exports = (req, res) => {
    res.status(500).json({
      error: 'Vercel Cold Start Error',
      message: error.message,
      stack: error.stack
    });
  };
}
