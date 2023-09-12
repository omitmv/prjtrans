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

const listTicketsAttendant = async () => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT b.*, CASE WHEN b.cd_usuario_abertura = c.cd_usuario THEN 0 ELSE 1 END AS status
            FROM (
                SELECT cd_chamado, MAX(cd_chamado_detalhe) cd_detalhe
                FROM TRANS.tbCmdDetalhe
                GROUP BY cd_chamado
            ) a
            INNER JOIN TRANS.tbChamado b ON( b.cd_chamado = a.cd_chamado )
            INNER JOIN TRANS.tbCmdDetalhe c ON( c.cd_chamado_detalhe = a.cd_detalhe )`,
      []
    )
    console.log(result)
    return result.rows
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/listTicketsAttendant', async function (req, res, next) {
  const result = await listTicketsAttendant()
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

const listTickets = async nCdUsuario => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT b.*, CASE WHEN c.cd_usuario = ${nCdUsuario} THEN 1 ELSE 0 END AS status
            FROM (
                SELECT cd_chamado, MAX(cd_chamado_detalhe) cd_detalhe
                FROM TRANS.tbCmdDetalhe
                WHERE cd_chamado IN(
                    SELECT cd_chamado
                    FROM TRANS.tbChamado
                    WHERE cd_usuario_abertura = ${nCdUsuario}
                )
                GROUP BY cd_chamado
            ) a
            INNER JOIN TRANS.tbChamado b ON( b.cd_chamado = a.cd_chamado )
            INNER JOIN TRANS.tbCmdDetalhe c ON( c.cd_chamado_detalhe = a.cd_detalhe )`,
      []
    )
    console.log(result)
    return result.rows
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/list', async function (req, res, next) {
  if (req.body.nCdUsuario) {
    const result = await listTickets(req.body.nCdUsuario)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const listDetail = async nCdChamado => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT a.cd_chamado_detalhe,
              a.cd_chamado,
              a.cd_usuario,
              b.login login_usuario,
              a.obs,
              TO_CHAR( a.dt_detalhe, 'DD/MM/YYYY HH24:MI:SS' ) data_detalhe
          FROM TRANS.tbCmdDetalhe a
          LEFT JOIN TRANS.tbCtrUsuario b ON( b.cd_usuario = a.cd_usuario )
          WHERE a.cd_chamado = ${nCdChamado}
          ORDER BY a.dt_detalhe DESC`,
      []
    )
    console.log(result)
    return result.rows
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/listDetail', async function (req, res, next) {
  if (req.body.nCdChamado) {
    const result = await listDetail(req.body.nCdChamado)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const cancelTicket = async nCdChamado => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `UPDATE TRANS.tbChamado
            SET fl_ativo = 'N',
            dt_ult_atualizacao = SYSDATE
            WHERE cd_chamado = ${nCdChamado}`,
      []
    )
    console.log(result)
    return result.rowsAffected > 0
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/cancelTicket', async function (req, res, next) {
  if (req.body.nCdChamado) {
    const result = await cancelTicket(req.body.nCdChamado)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const insertTicketDetail = async (nCdChamado, nCdUsuario, cObs) => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `INSERT INTO TRANS.tbCmdDetalhe(cd_chamado, cd_usuario, obs, dt_detalhe)
            VALUES(${nCdChamado}, ${nCdUsuario}, '${cObs}', SYSDATE)`,
      []
    )
    console.log(result)
    return result.rowsAffected > 0
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/insertTicketDetail', async function (req, res, next) {
  const { nCdChamado, nCdUsuario, cObs } = req.body
  if (nCdChamado && nCdUsuario && cObs) {
    const result = await insertTicketDetail(nCdChamado, nCdUsuario, cObs)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const listGroup = async () => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT *
            FROM TRANS.tbCmdGrupo
            WHERE fl_ativo = 'S'`,
      []
    )
    console.log(result)
    return result
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/listGroup', async function (req, res, next) {
  const result = await listGroup()
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

const listSubGroup = async nCdGrupo => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `SELECT *
            FROM TRANS.tbCmdSubGrupo
            WHERE fl_ativo = 'S'
            AND cd_grupo = ${nCdGrupo}`,
      []
    )
    console.log(result)
    return result
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/listSubGroup', async function (req, res, next) {
  if (req.body.nCdGrupo) {
    const result = await listSubGroup(req.body.nCdGrupo)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const insertNewTicket = async (nCdSubGrupo, nCdUsuarioAbertura, cObs) => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `INSERT INTO TRANS.tbChamado(cd_chamado, cd_sub_grupo, cd_usuario_abertura, obs)
            VALUES(TBCHAMADO_SEQ.nextval, ${nCdSubGrupo}, ${nCdUsuarioAbertura}, '${cObs}')`,
      []
    )
    console.log(result)
    return result.rowsAffected > 0
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/insertNewTicket', async function (req, res, next) {
  const { nCdSubGrupo, nCdUsuarioAbertura, cObs } = req.body
  if (nCdSubGrupo && nCdUsuarioAbertura && cObs) {
    const result = await insertNewTicket(nCdSubGrupo, nCdUsuarioAbertura, cObs)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

const closeTicket = async (nCdChamado, avaliacao) => {
  let conn
  try {
    conn = await oracledb.getConnection(config)
    const result = await conn.execute(
      `UPDATE TRANS.tbChamado
            SET avaliacao = ${avaliacao},
            dt_fechamento = SYSDATE
            WHERE cd_chamado = ${nCdChamado}`,
      []
    )
    console.log(result)
    return result.rowsAffected > 0
  } catch (err) {
    console.error(err)
    return err.message
  }
}

router.post('/closeTicket', async function (req, res, next) {
  const { nCdChamado, avaliacao } = req.body
  if (nCdChamado && avaliacao) {
    const result = await closeTicket(nCdChamado, avaliacao)
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
  } else {
    res.status(401).send({
      codigo: 401,
      message: `Dados inconsistentes.`,
      result: {}
    })
  }
})

module.exports = { router }
