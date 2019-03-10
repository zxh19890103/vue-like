module.exports = function (content, map, meta) {
    console.log(content, map, meta)
    return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}