/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const {
  fetcher,
  formatErrorResponse,
  formatOutput,
  formatCredentials
} = require('../utils')
const { isFormatValid } = require('../validator')

const inquirer = require('inquirer')
const config = require('../config')

/**
 * Retrieves a node information by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.nodeId Node ID
 * @returns {Promise} The information node promise
 */
async function infoNode({ accessToken, nodeId, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info(`Retrieving node with ID ${nodeId}.`)

  if (!nodeId) {
    const prompt = await inquirer.prompt([
      {
        name: 'nodeId',
        message: 'Enter the node id',
        type: 'text',
        validate: input => isFormatValid('node', input)
      }
    ])
    nodeId = prompt.nodeId
    if (!nodeId) {
      consola.error('Missing node id')
      return
    }
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`

  // eslint-disable-next-line consistent-return
  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving node information, requested resource not found: ${res.status}`
      )
      return
    }

    const data = {
      id: res.data.id,
      createdAt: res.data.createdAt,
      stoppedAt: res.data.stoppedAt,
      chain: res.data.chain,
      network: res.data.network,
      version: res.data.serviceData.software,
      performance: res.data.serviceData.performance,
      state: res.data.state,
      ip: res.data.ip,
      ...formatCredentials(res.data.auth)
    }

    formatOutput(isJson, data)
  })
}

module.exports = infoNode
