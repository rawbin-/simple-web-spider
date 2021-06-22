const fse = require('fs-extra')
const path = require('path')
async function writeContent(parent,filename, content){
    const basePath = path.resolve(process.cwd(),'../data',parent)
    await fse.mkdirp(basePath).then(() => {
        return fse.writeFile(path.join(basePath,`${filename}.html`),content)
    })
}

module.exports = {
    writeContent
}
