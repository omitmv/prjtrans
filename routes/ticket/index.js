//require('dotenv-safe').config()
const express = require('express')
const router = express.Router()
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const config = {
    //    user: process.env.ORACLE_USER,
    //    password: process.env.ORACLE_PASS,
    //    connectString: process.env.ORACLE_CONNECT_STRING
    user: 'TRANS',
    password: 'TRANS',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=200.95.188.251)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=oracle)))'
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