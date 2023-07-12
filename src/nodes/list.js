'use strict'

const consola = require('consola')
const {
  fetcher,
  formatResponse,
  formatErrorResponse,
  formatOutput
} = require('../utils')
require('console.table')

const config = require('../config')

/**
 * Retrieves nodes
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} [params.all] Boolean defining if it should show killed nodes
 * @param {string} [params.allUsers] List nodes from all users
 * @param {string} [params.json] Format output as JSON
 * @returns {Promise} The information nodes promise
 */
async function listNodes({ accessToken, all, allUsers, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving all nodes\n')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}${
    allUsers ? '/nodes' : '/users/me/nodes'
  }`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(isJson, `Error retrieving nodes: ${res.status}`)
      return
    }
    let body = res.data
    if (!body) {
      return
    }

    if (!body.length) {
      const user = `${config.get('user')}`
      formatResponse(isJson, `No nodes were found for user ${user}`)
      return
    }
    body = body.map(function ({
      chain,
      createdAt,
      id,
      ip,
      network,
      serviceData,
      state,
      stoppedAt,
      user
    }) {
      const node = {
        id,
        ip,
        chain,
        network,
        version: serviceData.software,
        performance: serviceData.performance,
        state,
        createdAt
      }

      if (all) {
        node.stoppedAt = stoppedAt || 'N/A'
      }
      if (allUsers) {
        node.user = user
      }
      return node
    })

    if (!all) {
      body = body.filter(n => n.state !== 'stopped')
    }

    !isJson && consola.success(`Got ${body.length} nodes:\n`)
    formatOutput(isJson, body)
  })
}

module.exports = listNodes
