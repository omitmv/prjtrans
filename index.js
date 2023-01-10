const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { getToken } = require('./utils/cripto.js')

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
    if (req.body.idUser) {
        let idUser = req.body.idUser
        const token = getToken(idUser)
        res.json({ auth: true, idUser, token })
        res.status(200).end()
    } else {
        res.json({ auth: false })
        res.status(500).end()
    }
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