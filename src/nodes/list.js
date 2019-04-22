'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

async function listNodes (clientId, accessToken, flags) {
  consola.info(`Retrieving all nodes node with client ID ${clientId}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/nodes`
  const spinner = ora().start()

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving all nodes: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving all nodes: ${data.code}`)
    }

    let body = JSON.parse(data.body)
    body = body.map(function (n) {
      delete n.user
      delete n.instance
      n.PublicIpAddress = n.vendor.PublicIpAddress
      delete n.vendor
      return n
    })

    if (!flags.all) {
      body = body.filter(n => n.state !== 'stopped')
    }

    if (!body.length) {
      const user = `${config.get('user')}`
      return consola.success(`No nodes were found for user ${user}`)
    }

    consola.success(`Got ${body.length} nodes:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listNodes
