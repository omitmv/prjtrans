const { dotenv } = require('./utils/variables')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { criptGetToken } = require('./utils/cripto.js')

app.use(bodyParser.json())

//Rotas
//user
const userRoutes = require('./routes/user')
app.use('/user', verifyJWT, userRoutes.router)

//client
const clientRoutes = require('./routes/client')
app.use('/client', verifyJWT, clientRoutes)

//ticket
const ticketRoutes = require('./routes/ticket')
app.use('/ticket', verifyJWT, ticketRoutes)

//login
app.post('/login', async(req, res) => {
    if (req.body.login && req.body.pass) {
        const body = req.body
        const result = await userRoutes.auth(body.login, body.pass)
        res.json(result)
            /*
                if (result.CD_USUARIO) {
                    const token = criptGetToken(result)
                    res.json({ auth: true, token })
                    res.status(200).end()
                } else {
                    res.json({ auth: false, message: result })
                    res.status(500).end()
                }
                */
    } else {
        res.json({ auth: false, message: `Dados inconsistentes.` })
        res.status(500).end()
    }
})

//Verificar JWT
function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token']
    jwt.verify(token, dotenv.SECRET, (err, decoded) => {
        if (err) return res.status(401).end()
        next()
    })
}

app.listen(dotenv.PORT_API, () => {
    console.log(`Example app listening on port ${dotenv.PORT_API} !`)
})