const htmlOutput = require('../../output/file/html')

async function bookResolverDebug(page,browser,bookTitle){
    const [chapterTitle,chapterLink] = await page.$eval("#js_content a", (links) => {
        return links.map(link => [link.text,link.href])
    })
    const chapterPage = await browser.newPage()
    await chapterPage.goto(chapterLink,{
        // waitUntil: 'networkidle0'
    })
    const content = await chapterPage.content()
    await htmlOutput.writeContent(bookTitle,chapterTitle,content)
}

async function bookResolver(page,browser,bookTitle){

    const chapters = await page.$$eval("#js_content a", (links) => {
        return links.map(link => [link.text,link.href])
    })
    const chapterPage = await browser.newPage()

    for (let chapter of chapters){
        const [chapterTitle,chapterLink] = chapter
        await chapterPage.goto(chapterLink,{
            // waitUntil: 'networkidle0'
        })
        const content = await chapterPage.content()
        await htmlOutput.writeContent(bookTitle,chapterTitle,content)
    }

    return await chapterPage.close()
}


module.exports = bookResolver
