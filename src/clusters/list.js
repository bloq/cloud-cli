'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

/**
 * Retrieves cluster
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.all Boolean defining if it should show killed clusters
 * @returns {Promise} The information cluster promise
 */
async function listClusters ({ accessToken, all }) {
  consola.info('Retrieving clusters.')

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
      alias,
      chain,
      createdAt,
      id,
      name,
      network,
      service,
      serviceData = {},
      state,
      stoppedAt
    }) {
      const cluster = {
        id,
        chain,
        network,
        name: alias || name,
        subdomain: name,
        state,
        createdAt,
        service,
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
