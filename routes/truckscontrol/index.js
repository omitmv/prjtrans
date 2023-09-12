require('dotenv/config')

const request = require('superagent')
const express = require('express')
const fs = require('fs')
const unzipper = require('unzipper')

const router = express.Router()

router.post('/alertas', async function (req, res, next) {
  let xml = ''
  request
    .post('https://webservice.newrastreamentoonline.com.br/')
    .set('content-type', 'application/xml')
    .send(req.body.xml)
    .on('error', function (e) {
      res.status(401).json({
        codigo: 401,
        message: `Erro ao baixar o arquivo`,
        result: err
      })
    })
    .pipe(fs.createWriteStream('download.zip'))
    .on('finish', function (d) {
      fs.createReadStream('download.zip')
        .pipe(unzipper.Parse())
        .on('entry', function (entry) {
          const fileName = entry.path
          const type = entry.type
          const size = entry.vars.uncompressedSize
          entry.pipe(
            fs
              .createWriteStream('output/truckscontrol.xml')
              .on('error', err => {
                res.status(401).json({
                  codigo: 401,
                  message: `Erro ao descompactar o arquivo`,
                  result: err
                })
              })
              .on('ready', () => {
                fs.createReadStream('output/truckscontrol.xml')
                  .on('data', function (chunk) {
                    xml += chunk.toString()
                  })
                  .on('end', function (chunk) {
                    res.status(200).json({
                      codigo: 200,
                      message: `OK`,
                      result: xml
                    })
                  })
              })
          )
        })
    })
})

module.exports = { router }
