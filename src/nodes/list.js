'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

/**
 *  Get all nodes
 *
 * @param  {Object} options { accessToken, nodeId }
 * @returns {Promise}
 */
async function listNodes ({ accessToken, all }) {
  consola.info('Retrieving all nodes.')

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
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
    body = body.map(function ({
      id,
      chain,
      state,
      network,
      ip,
      createdAt,
      serviceData,
      stoppedAt
    }) {
      const node = {
        id,
        chain,
        network,
        ip,
        state,
        createdAt,
        version: serviceData.software,
        performance: serviceData.performance
      }

      if (all) {
        node.stoppedAt = stoppedAt || 'N/A'
      }
      return node
    })

    if (!all) {
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
