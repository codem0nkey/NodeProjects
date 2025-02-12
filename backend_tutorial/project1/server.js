const express = require('express')
const app = express()
const PORT = 7777

let data = [
    {name: "Marc"}
]

//Middleware
app.use(express.json())

//Website endpoints

app.get('/', (req, res) => {
    console.log('Default route request received.')
    res.send('<h1>Homepage</h1>')
})

app.get('/dashboard', (req, res) => {
    console.log('Dashboard request received.')
    res.send('<h1>Dashboard</h1>')
})

//API endpoints

app.get('/api/data', (req, res) => {
    console.log('API GET Request on /api/data ')
    res.send(data)
})

app.post('/api/data/adduser', (req,res) => {
    const newUser = req.body
    console.log(newUser)
    data.push({"name": newUser.name})
    res.sendStatus(201)
})


app.listen(PORT, () => console.log (`Server has started on: ${PORT}`))