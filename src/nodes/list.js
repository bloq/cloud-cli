'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
require('console.table')

const config = require('../config')

/**
 * Retrieves nodes
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.all Boolean defining if it should show killed nodes
 * @returns {Promise} The information nodes promise
 */
async function listNodes({ accessToken, all }) {
  consola.info('Retrieving all nodes')

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
  const spinner = ora().start()

  const params = {
    method: 'GET',
    headers: {
      Authorization,
      'Content-Type': 'application/json'
    }
  }

  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving all nodes: ${res.statusText || res.status}`
        )
      }

      return res.json()
    })
    .then(res => {
      let body = res
      if (!body) return

      if (!body.length) {
        const user = `${config.get('user')}`
        return consola.success(`No nodes were found for user ${user}`)
      }
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

      consola.success(`Got ${body.length} nodes:`)
      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      return console.table(body)
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error retrieving all nodes: ${err}.`)
    })
}

module.exports = listNodes
