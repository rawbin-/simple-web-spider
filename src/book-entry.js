const puppeteer = require('puppeteer')
const wxBook = require('./resolver/weixin/book')

const startUrl = 'https://mp.weixin.qq.com/s?__biz=MzA3MzM2MjkxNw==&mid=2652798384&idx=3&sn=f9794842fcd1623813d2d26fffa059bd&chksm=84fae13ab38d682cac5f21b4085eb0d0190a83eef3fdad220aa52359f926b3baf0a0c61d24f4&scene=21#wechat_redirect'

;(async () => {
    const browser = await puppeteer.launch({
        headless:true
    })
    const page = await browser.newPage()
    await page.goto(startUrl,{
        // waitUntil: 'networkidle0'
    })

    await wxBook(page,browser,`书名-${Date.now()}`)

    await page.close()
    await browser.close()
})();
