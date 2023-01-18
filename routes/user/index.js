const { dotenv } = require('../../utils/variables')
const express = require('express')
const router = express.Router()
const oracledb = require('oracledb')
const md5 = require('md5')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const config = {
    user: dotenv.ORACLE_USER,
    password: dotenv.ORACLE_PASS,
    connectString: dotenv.ORACLE_CONNECT_STRING
}

router.get('/', function(req, res, next) {
    res.status(200).json({ rota: '/user' })
})

router.get('/teste', function(req, res, next) {
    res.status(200).json({ rota: '/user/teste' })
})

const auth = async(login, pass) => {
    let conn

    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `SELECT * 
            FROM TRANS.tbCtrUsuario 
            WHERE login = '${login}'
            AND senha = '${md5(pass)}'`, []
        )
        return result.rows[0]
    } catch (err) {
        return err.message
    } finally {
        if (conn) {
            try {
                await conn.close()
            } catch (err) {
                return err.message
            }
        }
    }
}

module.exports = { router, auth }