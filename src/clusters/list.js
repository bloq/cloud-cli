'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

/**
 *  Get all clusters
 *
 * @param  {Object} options { accessToken, all }
 * @returns {Promise}
 */
async function listClusters ({ accessToken, all }) {
  consola.info('Retrieving all clusters.')

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/clusters`
  const spinner = ora().start()

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving all clusters: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving all clusters: ${data.code}`)
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
      const cluster = {
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
        cluster.stoppedAt = stoppedAt || 'N/A'
      }

      return cluster
    })

    if (!all) {
      body = body.filter(n => n.state !== 'stopped')
    }

    if (!body.length) {
      const user = `${config.get('user')}`
      return consola.success(`No clusters were found for user ${user}`)
    }

    consola.success(`Got ${body.length} clusters:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listClusters
