require('dotenv/config')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const { criptGetToken } = require('./utils/cripto.js')

const app = express()

app.use(cors())
app.use(bodyParser.json())

//Rotas
//client
const clientRoutes = require('./routes/client')
app.use('/client', verifyJWT, clientRoutes)

//ticket
const ticketRoutes = require('./routes/ticket')
app.use('/ticket', verifyJWT, ticketRoutes)

//user
const userRoutes = require('./routes/user')
app.use('/user', verifyJWT, userRoutes.router)

//login
app.post('/auth', async(req, res) => {
    if (req.body.login && req.body.pass) {
        const body = req.body
        const result = await userRoutes.auth(body.login, body.pass)
        if (result) {
            const token = criptGetToken(result)
            res
                .status(200)
                .json({ codigo: 200, message: `OK`, result: { auth: true, token } })
        } else {
            res.status(401).json({
                codigo: 401,
                message: `Usuário e/ou senha incorreto(s).`,
                result: { auth: false, token: '' }
            })
        }
    } else {
        res.status(401).json({
            codigo: 401,
            message: `Dados inconsistentes.`,
            result: {}
        })
    }
})

//Verificar JWT
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).end()
        next()
    })
}

app.listen(process.env.PORT_API, () => {
    console.log(`Example app listening on port ${process.env.PORT_API} !`)
})