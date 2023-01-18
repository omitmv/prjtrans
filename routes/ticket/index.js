const { dotenv } = require('../../utils/variables')
const express = require('express')
const router = express.Router()
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const config = {
    user: dotenv.ORACLE_USER,
    password: dotenv.ORACLE_PASS,
    connectString: dotenv.ORACLE_CONNECT_STRING
}

router.get('/', async function(req, res, next) {
    let conn

    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `SELECT * FROM TRANS.tbCtrUsuario WHERE fl_ativo = 'S'`, []
        )
        res.status(200).send(result.rows)
    } catch (err) {
        res.status(401).send(err.message)
    } finally {
        if (conn) {
            try {
                await conn.close()
            } catch (err) {
                res.status(401).send(err.message)
            }
        }
    }
})

module.exports = router