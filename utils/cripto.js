const jwt = require('jsonwebtoken')
const { dotenv } = require('./variables')

const criptGetToken = value => {
    return jwt.sign({ userId: value }, dotenv.SECRET, { expiresIn: 300 })
}

module.exports = { criptGetToken }