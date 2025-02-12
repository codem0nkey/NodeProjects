const express = require('express')
const app = express()
const PORT = 7777

app.get('/', (req, res) => {
    console.log('Hello World!', req.method)
    res.sendStatus(200)
})

app.listen(PORT, () => console.log (`Server has started on: ${PORT}`))