require('dotenv/config')

const nodemailer = require('nodemailer')
const express = require('express')
const oracledb = require('oracledb')

const router = express.Router()

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.autoCommit = true

const config = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASS,
  connectString: process.env.ORACLE_CONNECT_STRING
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
})

router.post('/sendEmail', async (req, res) => {
  transporter.sendMail(
    {
      from: `Sistema automático`,
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.bodyEmail
    },
    function (err, data) {
      if (err) {
        console.log(err)
        res.status(401).json({
          codigo: 401,
          message: `Error`,
          result: err
        })
      } else {
        res.status(200).json({
          codigo: 200,
          message: `OK`,
          result: data
        })
      }
    }
  )
})

const alterPassword = async (nCdUsuario, cSenha) => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `UPDATE TRANS.tbCtrUsuario 
            SET senha = '${cSenha}'
            WHERE cd_usuario = ${nCdUsuario}`,
      []
    )
    console.log(result)
    return result.rowsAffected > 0
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/alterPassword', async function (req, res, next) {
  const { nCdUsuario, cSenha } = req.body
  if (req.body.nCdUsuario || req.body.cSenha) {
    const result = await alterPassword(nCdUsuario, cSenha)
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

module.exports = { router }
