require('dotenv/config')

const express = require('express')
const oracledb = require('oracledb')
const md5 = require('md5')

const router = express.Router()

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.autoCommit = true

const config = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    connectString: process.env.ORACLE_CONNECT_STRING
}

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
        console.log(result)
        return result.rows[0]
    } catch (err) {
        console.error(err)
        return err.message
    }
}

const listUsers = async(cFlAdmin, cFlAtendente) => {
    let conn
    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `SELECT * 
            FROM TRANS.tbCtrUsuario 
            WHERE fl_ativo = 'S'
            AND fl_admin = '${cFlAdmin}'
            AND fl_atendente = '${cFlAtendente}'`, []
        )
        console.log(result)
        return result.rows
    } catch (err) {
        console.error(err)
        return err.message
    }
}

const delUser = async nCdUsuario => {
    let conn
    try {
        conn = await oracledb.getConnection(config)
        const result = await conn.execute(
            `UPDATE TRANS.tbCtrUsuario 
            SET fl_ativo = 'N'
            WHERE cd_usuario = '${nCdUsuario}'`, []
        )
        console.log(true)
        return true
    } catch (err) {
        console.error(err)
        return err.message
    }
}

router.get('/list', async function(req, res, next) {
    if (req.body.cFlAdmin && req.body.cFlAtendente) {
        const result = await listUsers(req.body.cFlAdmin, req.body.cFlAtendente)
        if (result) {
            res.status(200).json({
                codigo: 200,
                message: `OK`,
                result
            })
        } else {
            res.status(401).json({
                codigo: 401,
                message: `Nenhum dado encontrado.`,
                result
            })
        }
    } else {
        res.status(401).json({
            codigo: 401,
            message: `Dados inconsistentes.`,
            result: {}
        })
    }
})

router.put('/delUser', async function(req, res, next) {
    if (req.body.nCdUsuario) {
        const result = await delUser(req.body.nCdUsuario)
        if (result) {
            res.status(200).json({
                codigo: 200,
                message: `OK`,
                result
            })
        } else {
            res.status(401).json({
                codigo: 401,
                message: `Erro ao excluir registro.`,
                result
            })
        }
    } else {
        res.status(401).json({
            codigo: 401,
            message: `Dados inconsistentes.`,
            result: {}
        })
    }
})

module.exports = { router, auth }