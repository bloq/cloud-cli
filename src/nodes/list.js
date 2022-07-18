'use strict'

const consola = require('consola')
const { fetcher, formatResponse } = require('../utils')
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
async function listNodes({ accessToken, all, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving all nodes')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatResponse(isJson, `Error retrieving nodes: ${res.status}`)
      return
    }
    let body = res.data
    if (!body) {
      return
    }

    if (!body.length) {
      const user = `${config.get('user')}`
      formatResponse(isJson, `No nodes were found for user ${user}`, true)
      return
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

    if (isJson) {
      console.log(JSON.stringify(body, null, 2))
      return
    }

    consola.success(`Got ${body.length} nodes:`)
    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(body)
  })
}

module.exports = listNodes
