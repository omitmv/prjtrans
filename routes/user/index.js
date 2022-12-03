const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
    res.json({ rota: '/user' })
})

router.get('/teste', function(req, res, next) {
    res.json({ rota: '/user/teste' })
})

module.exports = router