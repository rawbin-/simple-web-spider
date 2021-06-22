const puppeteer = require('puppeteer')
const wxBooks = require('./resolver/weixin/books')

const startUrl = 'https://mp.weixin.qq.com/s/1kt9PVoonTsS2vmY9rWLxQ'

;(async () => {
    const browser = await puppeteer.launch({
        headless:true
    })
    const page = await browser.newPage()
    await page.goto(startUrl,{
        // waitUntil: 'networkidle0'
    })

    await wxBooks(page,browser)

    await page.close()
    await browser.close()
})();
