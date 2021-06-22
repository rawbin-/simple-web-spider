const bookResolver = require('./book')

async function booksResolverDebug(page,browser){
    const [bookTitle,bookLink] = await page.$eval("#js_content a", (link) => {
        return [link.text,link.href]
    })
    const bookPage = await browser.newPage()
    await bookPage.goto(bookLink,{
        // waitUntil: 'networkidle0'
    })

    return bookResolver(bookPage,browser,`debug-bookTitle`)
}

async function booksResolver(page,browser){

    const books = await page.$$eval("#js_content a", (links) => {
        return links.map(link => [link.text,link.href])
    })
    const bookPage = await browser.newPage()

    for (let book of books){
        const [bookTitle,bookLink] = book
        await bookPage.goto(bookLink,{
            // waitUntil: 'networkidle0'
        })
        await bookResolver(bookPage,browser,bookTitle)
    }

    return await bookPage.close()
}


module.exports = booksResolver
