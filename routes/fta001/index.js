require('dotenv/config')

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

const listFatVeiculo = async cPlaca => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT a.empresa codigo_empresa,
      a.filial codigo_filial,
      a.garagem codigo_garagem,
      a.data_emissao emissao,
      a.conhecimento documento,
      b.prefixoveic placa,
      a.total_prest total,
      a.frete_peso valor_frete_peso,
      a.pedagio valor_pedagio,
      a.valor_nf valor_nota
      FROM GLOBUS.fta001 a
      LEFT JOIN GLOBUS.frt_cadveiculos b ON( b.codigoveic = a.veiculo )
      WHERE a.tipo_docto IN( 1, 57 )
      AND a.data_cancelado = TO_DATE( '01010001', 'DDMMYYYY' )
      AND a.data_emissao > TO_DATE( '01012023 000000', 'DDMMYYYY HH24MISS' )
      AND b.prefixoveic LIKE '%${cPlaca}%'`,
      []
    )
    console.log(result)
    return result.rows
  } catch (err) {
    console.log(err)
    return err.message
  }
}

router.post('/listFatVeiculo', async function (req, res, next) {
  cPlaca = req.body.cPlaca
  const result = await listFatVeiculo(cPlaca)
  if (result) {
    res.status(200).send({
      codigo: 200,
      message: `OK`,
      result
    })
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Nenhum dado encontrado.`,
      result
    })
  }
})

module.exports = { router }
