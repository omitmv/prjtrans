require('dotenv-safe').config()
const jwt = require('jsonwebtoken')

const criptGetToken = value => {
    return jwt.sign({ userId: value }, process.env.SECRET, { expiresIn: 300 })
}

const criptVerifyJWT = value => {
    jwt.verify(value, process.env.SECRET, (err, decoded) => {
        if (err) {
            return err
        } else {
            return decoded.userId
        }
    })
}

module.exports = { criptGetToken, criptVerifyJWT }