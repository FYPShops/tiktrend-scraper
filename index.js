process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium-browser';// Entry point
const { scrapeTrendingProducts } = require('./uploader');
scrapeTrendingProducts();
