const htmlOutput = require('../../output/file/html')

async function bookResolverDebug(page,browser,bookTitle){
    const [chapterTitle,chapterLink] = await page.$eval("#js_content a", (link) => {
        return [link.text,link.href]
    })
    const chapterPage = await browser.newPage()
    await chapterPage.goto(chapterLink,{
        // waitUntil: 'networkidle0'
    })
    const content = await chapterPage.content()
    await htmlOutput.writeContent(bookTitle,chapterTitle,content)
}


async function processChapterLinks(browser, chapters, bookTitle) {
    const chapterPage = await browser.newPage()
    for (let chapter of chapters) {
        const [chapterTitle, chapterLink] = chapter
        await chapterPage.goto(chapterLink, {
            // waitUntil: 'networkidle0'
        })
        const content = await chapterPage.content()
        console.log(`正在处理:${bookTitle} ${chapterTitle}`)
        await htmlOutput.writeContent(bookTitle, chapterTitle, content)
    }

    return await chapterPage.close()
}

async function bookResolver(page,browser,bookTitle){

    const topicFlag = await page.$eval("div.album.js_album_container", target => {
        return Promise.resolve(!!target)
    }).catch(e => {
        console.log('没找到选择器，抛异常',e)
    })

    const pageContent = await page.content()
    // 书籍列表=>书籍介绍=>章节列表
    const hasTwoLevelLink = pageContent.indexOf('阅读全文请点击以下专辑链接') !== -1

    const chapters = await page.$$eval("#js_content a", (links) => {
        return links.filter(link => link.text.trim()).map(link => [link.text,link.href])
    })

    // 是话题
    if(topicFlag){
        console.log('##处理话题章节列表')
        // 这是一个列表页，需要滚动分页
        let chapters = await page.$$eval("li.album__list-item.js_album_item", (links) => {
            return links.map(link => [link.dataset.title,link.dataset.link])
        })
        let chaptersCount = chapters.length

        //滚动到页面最底端，以获取所有链接
        do{
            console.log('滚动鼠标到页面底端，延时5s')
            chaptersCount = chapters.length
            await page.mouse.wheel({deltaY:5000})
            await page.waitForTimeout(5000)
            chapters = await page.$$eval("li.album__list-item.js_album_item", (links) => {
                return links.map(link => [link.dataset.title,link.dataset.link])
            })
        }while (chaptersCount != chapters.length)

        return await processChapterLinks(browser, chapters, bookTitle);

    }else if(hasTwoLevelLink){
        console.log('##处理二级书目介绍页')
        // 是二级介绍页 这个时候把介绍页也搞下来
        const [bookTitle, bookLink] = chapters[0]
        const bookPage = await browser.newPage()
        await bookPage.goto(bookLink, {
            // waitUntil: 'networkidle0'
        })
        return await bookResolver(bookPage, browser, bookTitle)
    }else{
        //是连载的章节页面
        console.log("##处理连载章节列表")
        return await processChapterLinks(browser, chapters, bookTitle);
    }
}


module.exports = bookResolver
