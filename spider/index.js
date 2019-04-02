const http = require('http')
const Walker = require('./walker')

let lastUrl = null
//http://c.biancheng.net/view/1369.html
const R = (url) => {
    console.log('R:', url)
    if (url === lastUrl) {
        console.log('All are downloaded:')
        return
    }
    const req = http.request(url, (res) => {
        let data = ''
        res.on('data', (chunk) => {
            data += chunk
        })
        res.on('end', () => {
            lastUrl = url
            doWalk(data)
        })
    })
    
    req.end()
}

const doWalk = (data) => {
    console.log('Begin to crap')
    const walker = new Walker({
        startText: '<div id="arc-body">',
        endText: '</div>\n<div class="pre-next-page clearfix">',
        replaceConfig: [
            [ /<(\/?)h2>/g, '<$1h3>'],
            [ /<br\s\/>\n?/g, '' ],
            [ /[\n\t]/g, '' ],
            [ /<\/h([34])>/g, '<\/h$1><p>'],
            [ /<h([34])>/g, '</p><h$1>'],
            [ /\s(href|src)=("|')([\w-\.\/]+)("|')/g, ' $1="http://c.biancheng.net$3"' ],
            [ /<pre class="cpp">(.+)<\/pre>/gs, '<pre class="language-cpp"><code>$1</code></pre>' ],
            [/<div[\s\n\t]+style="text-align: center;"><(a|img)/g, '<div class="img-container"><$1']
        ],
        onWalkDone: () => {
            console.log('Now next URL: ', walker.nextUrl)
            R(walker.nextUrl)
        }
    })
    walker.readStream = data
    walker.walk()
}

// doWalk(`
// <div id="arc-body">mdfksdfmsd<h4>fksdfs</h4>dhahaha<div class="pre-next-page clearfix">
// `)

R('http://c.biancheng.net/view/1317.html')