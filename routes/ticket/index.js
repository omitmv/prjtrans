require('dotenv').config()
const express = require('express')
const router = express.Router()
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const config = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: process.env.ORACLE_CONNECT_STRING
}

router.get('/', async function(req, res, next) {
    let conn

    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `SELECT * FROM TRANS.tbCtrUsuario WHERE fl_ativo = 'S'`, []
        )
        res.send(result.rows)
    } catch (err) {
        res.send(err.message)
    } finally {
        if (conn) {
            try {
                await conn.close()
            } catch (err) {
                res.send(err.message)
            }
        }
    }
})

module.exports = router