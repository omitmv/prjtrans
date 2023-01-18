const jwt = require('jsonwebtoken')

const criptGetToken = value => {
    return jwt.sign({ userId: value }, 'byOmitmv@123', { expiresIn: 300 })
}

module.exports = { criptGetToken }