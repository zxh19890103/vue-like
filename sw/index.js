navigator.serviceWorker.register('/run.js').then((reg) => {
    console.log('Sw reg done:', reg.scope)    
}).catch(err => {
    console.log('Sw reg failed:', err)
})