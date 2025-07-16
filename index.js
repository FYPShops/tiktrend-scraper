const puppeteer = require('puppeteer');
const { hashtags, maxVideos, headless, scrollDelay } = require('./config');
const { uploadToAutoDS } = require('./uploader');

async function scrapeHashtag(tag) {
  const url = `https://www.tiktok.com/tag/${tag}`;
  const browser = await puppeteer.launch({ headless });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  let videos = [];

  try {
    await page.waitForSelector('div[data-e2e="search_video_item"]', { timeout: 10000 });

    videos = await page.$$eval('div[data-e2e="search_video_item"]', (nodes) => {
      return nodes.map((el) => {
        const title = el.innerText || 'Untitled';
        const videoLink = el.querySelector('a')?.href || '';
        return { title, videoLink };
      });
    });

    videos = videos.slice(0, maxVideos);

    for (const vid of videos) {
      console.log('Found:', vid.title);
      await uploadToAutoDS(vid);
    }
  } catch (err) {
    console.error('Error scraping hashtag:', tag, err.message);
  }

  await browser.close();
}

(async () => {
  console.log('📈 TikTrend Scraper v1.0 started...');
  for (const tag of hashtags) {
    console.log(`🔍 Scraping #${tag}...`);
    await scrapeHashtag(tag);
  }
})();
