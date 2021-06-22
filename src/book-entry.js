const puppeteer = require('puppeteer')
const wxBook = require('./resolver/weixin/book')

const startUrl = 'https://mp.weixin.qq.com/s?__biz=MzA3MzM2MjkxNw==&mid=2652800526&idx=1&sn=a5681b7c50fb09fd4c452c11e8b35a51&chksm=84fa1a84b38d93925cd107268f853e49cd5a33181e2d63657811a584da73dcf3ec6f7adaa137&scene=21#wechat_redirect'

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
