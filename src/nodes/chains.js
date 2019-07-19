'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

async function chainsNodes (clientId, accessToken, flags) {
  consola.info(`Retrieving list of available blockchains.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/chains`
  const spinner = ora().start()

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving available blockchains: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving available blockchains: ${data.code}`)
    }

    let body = JSON.parse(data.body)
    console.table(body)
  })
}

module.exports = chainsNodes
