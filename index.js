require('dotenv/config')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors())
app.use(bodyParser.json())

//Rotas
//truckscontrol
const truckscontrolRoutes = require('./routes/truckscontrol')
app.use('/truckscontrol', verifyJWT, truckscontrolRoutes.router)

//client
const clientRoutes = require('./routes/client')
app.use('/client', verifyJWT, clientRoutes.router)

//ticket
const ticketRoutes = require('./routes/ticket')
app.use('/ticket', verifyJWT, ticketRoutes.router)

//user
const userRoutes = require('./routes/user')
app.use('/user', verifyJWT, userRoutes.router)

//auth
const authRouter = require('./routes/auth')
app.use('/auth', authRouter.router)

//fta001
const fta001Router = require('./routes/fta001')
app.use('/fta001', fta001Router.router)

//utils
const utilsRouter = require('./routes/utils')
app.use('/utils', utilsRouter.router)

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
