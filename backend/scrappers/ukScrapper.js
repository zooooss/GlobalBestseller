import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import path from "path";

puppeteer.use(StealthPlugin());

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// CAPTCHA issue, cannot proceed with page 2
async function fetchBooksMain() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto("https://www.waterstones.com/books/bestsellers", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  const booksPage1 = await extractBooksFromMainPage(page, 24);
  
  await page.goto("https://www.waterstones.com/books/bestsellers?page=2", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  const booksPage2 = await extractBooksFromMainPage(page, 6);

  const books = booksPage1.concat(
    booksPage2.map((book, index) => ({
      rank: 24 + index + 1,
      title: book.title,
      author: book.author,
      href: book.href,
      image: book.image,
    }))
  );

  console.log(`Total ${books.length} of books retrieved.`);
  console.log('Starting detailed page crawling...');

  const concurrency = 5;
  for (let i = 0; i < books.length; i += concurrency) {
      const batch = books.slice(i, i + concurrency);
      const results = await Promise.all(batch.map(book => fetchBookDetail(browser, book.href)));
      results.forEach((data, idx) => {
          batch[idx].contents = data.contents;
      });
  }
  await browser.close();


  // --------------------- result_uk.json에 저장 ---------------------
  const resultPath = path.join(process.cwd(), '../json_results/uk.json');
  fs.writeFileSync(resultPath, JSON.stringify(books, null, 2), "utf-8");
  console.log(`Total ${books.length} of books saved to ${resultPath}.`);
}

async function fetchBookDetail(browser, href) {
  const page = await browser.newPage();
  try {
    await page.goto(href, { waitUntil: 'networkidle2' });
    await sleep(2000);
  
    await page.waitForSelector('section.book-info-tabs.ws-tabs.span12', { timeout: 30000 }).catch(() => {});

    const data = await page.evaluate(() => {
      let contents = '';
      const contentsEl = document.querySelector('#scope_book_description');
      if (contentsEl) {
        const paragraphs = contentsEl.querySelectorAll('p');
        paragraphs.forEach(p => {
          const text = p.textContent?.trim() || '';
          if (text) {
            contents += text + '\n';
          }
        });
      }
      return { contents };
    });

    await page.close();
    return data;
  } catch (err) {
    await page.close();
    console.error(`⚠️ 상세 정보 크롤링 실패 (${href}):`, err.message);
    return { contents: '' };
  }
}


async function extractBooksFromMainPage(page, limit) {
  await page.waitForSelector("div.book-preview", { timeout: 0 });

  const books = await page.evaluate((limit) => {
    const cards = Array.from(
      document.querySelectorAll("div.book-preview")
    ).slice(0, limit);
    const result = [];

    cards.forEach((card, index) => {
      const imageWrap = card.querySelector(
        "div.inner > div.book-thumb-container > div.book-thumb > div.image-wrap"
      );
      const infoWrap = card.querySelector(
        "div.inner > div.info-wrap"
      );

      if (!imageWrap || !infoWrap) return;

      const aTag = imageWrap.querySelector("a");
      const imgTag = imageWrap.querySelector("a > img");
      const image = imgTag ? imgTag.src || imgTag.getAttribute('data-src') || null : null;
      const href = aTag ? aTag.href : null;

      const author = infoWrap.querySelector("span.author > a > b")?.textContent.trim() || null;

      const titleEl =
        imageWrap.querySelector(
          "div.hover-layer > div > div > div.pre-add > span.visuallyhidden"
        ) || imageWrap.querySelector("div.hover-layer span.visuallyhidden");

      const title = titleEl ? titleEl.textContent.trim() : null;

      result.push({ rank: index + 1, title, author, href, image });

    });
    return result;
  }, limit);
  return books;
}


fetchBooksMain();
