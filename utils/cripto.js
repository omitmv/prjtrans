require('dotenv/config')

const jwt = require('jsonwebtoken')

const criptGetToken = value => {
  //return jwt.sign({ userId: value }, process.env.SECRET, { expiresIn: 300 })
  return jwt.sign({ userId: value }, process.env.SECRET)
}

module.exports = { criptGetToken }
