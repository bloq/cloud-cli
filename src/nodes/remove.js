/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
const inquirer = require('inquirer')

const config = require('../config')

/**
 * Removes a node by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.nodeId Node ID
 * @returns {Promise} The remove node promise
 */
async function removeNode({ accessToken, nodeId }) {
  consola.info('Removing node')

  if (!nodeId) {
    const prompt = await inquirer.prompt([
      { name: 'nodeId', message: 'Enter the node id', type: 'text' }
    ])

    nodeId = prompt.nodeId
    if (!nodeId) {
      return consola.error('Missing node id')
    }
  }

  const { confirmation } = await inquirer.prompt([
    {
      name: 'confirmation',
      message: `You will remove the node with id ${nodeId}. Do you want to continue?`,
      type: 'confirm',
      default: false
    }
  ])

  if (!confirmation) {
    return consola.error('Remove node was canceled.')
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) return consola.error(`Error removing the node: ${res.status}`)

    return consola.success(`Node with id ${nodeId} removed successfully`)
  })
}

module.exports = removeNode
