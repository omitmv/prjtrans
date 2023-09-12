require('dotenv/config')

const express = require('express')
const oracledb = require('oracledb')
const { criptGetToken } = require('../../utils/cripto.js')

const router = express.Router()

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.autoCommit = true

const config = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASS,
  connectString: process.env.ORACLE_CONNECT_STRING
}

const auth = async (login, pass) => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT * 
            FROM TRANS.tbCtrUsuario 
            WHERE login = '${login}'
            AND senha = '${pass}'
            AND fl_ativo = 'S'`,
      []
    )
    console.log(result)
    return result.rows[0]
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/', async (req, res) => {
  if (req.body.value) {
    const value = atob(req.body.value)
    const { login, pass } = JSON.parse(value)
    const result = await auth(login, pass)
    if (result) {
      const token = criptGetToken(result)
      res
        .status(200)
        .json({ codigo: 200, message: `OK`, result: { auth: true, token } })
    } else {
      res.status(401).json({
        codigo: 401,
        message: `Usuário e/ou senha incorreto(s).`,
        result: { auth: false, token: '' }
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

const getUserWithLogin = async cLogin => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT CD_USUARIO, LOGIN, EMAIL, FL_ATIVO
            FROM TRANS.tbCtrUsuario
            WHERE login = '${cLogin}'
            AND fl_ativo = 'S'`,
      []
    )
    console.log(result)
    return result
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/getUserWithLogin', async function (req, res, next) {
  const { cLogin } = req.body
  if (cLogin) {
    const result = await getUserWithLogin(cLogin)
    if (result) {
      res.status(200).json({
        codigo: 200,
        message: `OK`,
        result
      })
    } else {
      res.status(401).json({
        codigo: 401,
        message: `Erro recuperar registro.`,
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

module.exports = { router }
