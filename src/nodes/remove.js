/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
'use strict'

const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
const { isFormatValid } = require('../validator')

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
async function removeNode({ accessToken, nodeId, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info(`Removing node`)

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
      formatErrorResponse(isJson, 'Missing node id')
      return
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
    formatResponse(isJson, 'Remove node was canceled.')
    return
  }

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`

  return fetcher(url, 'DELETE', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(isJson, `Error removing the node: ${res.status}`)
      return
    }

    formatResponse(isJson, `Node with id ${nodeId} removed successfully`)
  })
}

module.exports = removeNode
