const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");
const config = require("./config");
const uploader = require("./uploader");

(async () => {
  console.log("🚀 TikTrend Scraper v1.1 (Render-compatible) starting...");
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });

  const page = await browser.newPage();
  await page.goto(`https://www.tiktok.com/tag/${config.hashtag.replace("#", "")}`, { waitUntil: "networkidle2" });

  const products = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll("div[data-e2e='search-video-item']");
    items.forEach((item, index) => {
      if (index < 5) {
        const title = item.innerText || "Trending Product";
        const link = item.querySelector("a")?.href || "";
        results.push({ title, link });
      }
    });
    return results;
  });

  console.log("📦 Found products:", products);
  await browser.close();

  await uploader(products);
})();