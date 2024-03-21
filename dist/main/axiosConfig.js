const axios = require("axios").default;
const { ProxyAgent } = require("proxy-agent");

const agent = new ProxyAgent();

axios.defaults.httpAgent = agent;
axios.defaults.httpsAgent = agent;
axios.defaults.proxy = false;

module.exports = axios;
