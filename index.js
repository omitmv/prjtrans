const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv-safe').config()
const jwt = require('jsonwebtoken')

app.use(bodyParser.json())

//Rotas

//user
const userRoutes = require('./routes/user')
app.use('/user', verifyJWT, userRoutes)

//client
const clientRoutes = require('./routes/client')
app.use('/client', verifyJWT, clientRoutes)

//ticket
const ticketRoutes = require('./routes/ticket')
app.use('/ticket', verifyJWT, ticketRoutes)

app.post('/login', (req, res) => {
    const token = jwt.sign({ userId: 1 }, process.env.SECRET, { expiresIn: 300 })
    res.json({ auth: true, token })
    res.status(200).end()
})

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).end()
        req.userId = decoded.userId
        next()
    })
}

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT} !`)
})