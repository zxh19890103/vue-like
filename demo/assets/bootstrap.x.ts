const uploadCtrl = document.querySelector('#uploadCtrl') as HTMLInputElement
const allMimetypes = document.querySelector('#allMimetypes') as HTMLDivElement

const getExt = (name) => {
    const dot = name.lastIndexOf('.')
    return name.substr(dot)
}

const dup = {
}

uploadCtrl.addEventListener('change', (evt) => {
    let file = null, ext = ''
    for (let i = 0, l = uploadCtrl.files.length; i < l; i ++) {
        file = uploadCtrl.files[i]
        ext = getExt(file.name)
        if (!ext || dup[ext] === 1) continue
        dup[ext] = 1
        allMimetypes.appendChild(document.createTextNode(ext))
        allMimetypes.appendChild(document.createElement('br'))
        allMimetypes.appendChild(document.createTextNode(file.type ? file.type : '--'))
        allMimetypes.appendChild(document.createElement('br'))
    }
})