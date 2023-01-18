const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { criptGetToken } = require('./utils/cripto.js')

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

//login
app.post('/login', (req, res) => {
    if (req.body.idUser) {
        let idUser = req.body.idUser
        const token = criptGetToken(idUser)
        res.json({ auth: true, idUser, token })
        res.status(200).end()
    } else {
        res.json({ auth: false })
        res.status(500).end()
    }
})

//Verificar JWT
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, 'byOmitmv@123', (err, decoded) => {
        if (err) return res.status(401).end()
        req.userId = decoded.userId
        next()
    })
}

app.listen(3000, () => {
    console.log(`Example app listening on port 3000, teste !`)
})