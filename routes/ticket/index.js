require('dotenv/config')

const express = require('express')
const router = express.Router()
const oracledb = require('oracledb')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const config = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: process.env.ORACLE_CONNECT_STRING
}

const listTickets = async data => {
    let conn
    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `SELECT * FROM TRANS.tbCtrUsuario WHERE fl_ativo = 'S'`, []
        )
        console.log(result)
        return result.rows
    } catch (err) {
        console.error(err)
        return err.message
    }
}

router.get('/', async function(req, res, next) {
    if (req.body.teste) {
        const result = await listTickets(req.body.teste)
        if (result) {
            res.status(200).send({
                codigo: 200,
                message: `OK`,
                result: result.rows
            })
        } else {
            res.status(401).send({
                codigo: 401,
                message: `Nenhum dado encontrado.`,
                result
            })
        }
    } else {
        res.status(401).send({
            codigo: 401,
            message: `Dados inconsistentes.`,
            result
        })
    }
})

module.exports = router