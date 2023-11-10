require('dotenv').config({ path: './.env' });

const config = {
  apiKey: process.env.API_KEY || 'defaultApiKey',
};

module.exports = config;

console.log(config.apiKey);
