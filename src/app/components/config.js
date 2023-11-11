require('dotenv').config({ path: './.env' });

const config = {
  apiKey: process.env.API_KEY || 'defaultApiKey',
};
console.log(config);
module.exports = config;

