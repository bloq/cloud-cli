/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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
async function logsNode({ accessToken, nodeId, lines = 100 }) {
  if (!nodeId) {
    const prompt = await inquirer.prompt([
      {
        name: 'nodeId',
        message: 'Enter the node id',
        type: 'text',
        validate: input => isFormatValid('node', input)
      },
      {
        name: 'lines',
        message: 'Max lines to retrieve',
        type: 'number',
        default: 100
      }
    ])

    nodeId = prompt.nodeId
    if (!nodeId) {
      consola.warning('Missing node id')
      return
    }
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}/logs?lines=${lines}`

  // eslint-disable-next-line consistent-return
  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error retrieving node logs: ${res.message}`)
      return
    }

    console.log(res.data)
  })
}

module.exports = logsNode
