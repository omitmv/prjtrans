const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
    res.json({ rota: '/ticket' })
})

module.exports = router