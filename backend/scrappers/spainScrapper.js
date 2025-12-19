import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPageBooks(browser) {
  const page = await browser.newPage();
  const url = 'https://www.amazon.es/gp/bestsellers/books';

  console.log('📍 Navigating to Amazon ES bestsellers...');
  await page.goto(url, { waitUntil: 'networkidle2' });
  await sleep(3000); // 더 긴 대기 시간

  const { books, links } = await page.evaluate(() => {
    const books = [];
    const links = [];

    // 더 넓은 셀렉터로 시도
    const items = document.querySelectorAll('ol li.zg-item-immersion, ol li');
    console.log(`Found ${items.length} items on page`);

    for (let i = 0; i < items.length; i++) {
      if (books.length >= 30) break;

      const li = items[i];

      // 다양한 셀렉터 시도
      const detailHref =
        li.querySelector('div a.a-link-normal')?.href ||
        li.querySelector('a[href*="/dp/"]')?.href ||
        '';

      const title =
        li.querySelector('div a.a-link-normal span div')?.innerText ||
        li.querySelector('.p13n-sc-truncate')?.innerText ||
        li.querySelector('[class*="title"]')?.innerText ||
        '';

      const image =
        li.querySelector('div.a-section img')?.src ||
        li.querySelector('img[src*="amazon"]')?.src ||
        '';

      const author =
        li.querySelector('div a.a-size-small div')?.innerText ||
        li.querySelector('.a-size-small.a-link-child')?.innerText ||
        li.querySelector('[class*="author"]')?.innerText ||
        '';

      if (title && detailHref) {
        books.push({ title, author: author || 'Unknown', image, detailHref });
        links.push(detailHref);
      }
    }

    return { books, links };
  });

  console.log(`✅ Found ${books.length} books on main page`);

  // 디버깅: 첫 3개 책 정보 출력
  books.slice(0, 3).forEach((book, i) => {
    console.log(`  ${i + 1}. ${book.title.substring(0, 50)}...`);
  });

  await page.close();
  return { books, links };
}

async function fetchBookDetail(browser, link) {
  const detailPage = await browser.newPage();
  try {
    await detailPage.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(1000);

    const data = await detailPage.evaluate(() => {
      const description =
        document
          .querySelector('#bookDescription_feature_div div.a-expander-content')
          ?.innerText.trim() ||
        document
          .querySelector('#bookDescription_feature_div')
          ?.innerText.trim() ||
        document
          .querySelector('[data-feature-name="bookDescription"]')
          ?.innerText.trim() ||
        '';

      const reviewSection =
        document
          .querySelector('#editorialReviews_feature_div div.a-section')
          ?.innerText.trim() ||
        document
          .querySelector('#editorialReviews_feature_div')
          ?.innerText.trim() ||
        '';

      const writerInfo =
        document
          .querySelector(
            'div._about-the-author-card_style_cardContentDiv__FXLPd',
          )
          ?.innerText.trim() ||
        document
          .querySelector('[data-feature-name="authorBio"]')
          ?.innerText.trim() ||
        '';

      return { description, other: reviewSection, writerInfo };
    });

    await detailPage.close();
    return data;
  } catch (error) {
    console.error(`⚠️ Failed to fetch detail for ${link}:`, error.message);
    await detailPage.close();
    return { description: '', other: '', writerInfo: '' };
  }
}

export default async function spainScrapper() {
  const startTime = Date.now();
  const date = new Date();

  console.log('🇪🇸 Starting Spain (Amazon ES) scraper...');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ],
  });

  const { books, links } = await fetchPageBooks(browser);

  if (books.length === 0) {
    console.error('❌ No books found! Amazon might be blocking the request.');
    await browser.close();
    return;
  }

  console.log(`\n📚 Fetching details for ${books.length} books...`);
  const concurrency = 3; // 동시성 낮춤 (봇 감지 방지)

  for (let i = 0; i < books.length; i += concurrency) {
    const batchBooks = books.slice(i, i + concurrency);
    const batchLinks = links.slice(i, i + concurrency);

    const results = await Promise.allSettled(
      batchLinks.map(link => fetchBookDetail(browser, link)),
    );

    results.forEach((res, idx) => {
      const data =
        res.status === 'fulfilled'
          ? res.value
          : { description: '', other: '', writerInfo: '' };
      batchBooks[idx].description = data.description;
      batchBooks[idx].other = data.other;
      batchBooks[idx].writerInfo = data.writerInfo;
      console.log(`${i + idx + 1}. ${batchBooks[idx].title} ✅`);
    });

    // 배치 사이에 대기 (봇 감지 방지)
    if (i + concurrency < books.length) {
      await sleep(2000);
    }
  }

  // backend/json_results에 저장
  const outputDir = path.join(__dirname, '..', 'json_results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const resultPath = path.join(outputDir, 'spain.json');
  const sanitized = books.map(toPublicBook);
  fs.writeFileSync(resultPath, JSON.stringify(sanitized, null, 2), 'utf-8');

  console.log(`\n✅ Crawled ${books.length} books`);
  console.log(`💾 Saved to ${resultPath}`);
  console.log(`📆 Date ${date.getDate()}`);
  console.log(`⏱ Done in ${(Date.now() - startTime) / 1000}s`);
  await browser.close();
}

function toPublicBook(raw) {
  const clean = value => (value || '').trim();
  return {
    image: clean(raw.image),
    link: clean(raw.detailHref),
    title: clean(raw.title),
    author: clean(raw.author),
    writerInfo: clean(raw.writerInfo),
    description: clean(raw.description),
    other: clean(raw.other),
  };
}

// Run directly
spainScrapper();
