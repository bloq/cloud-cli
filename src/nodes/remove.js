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
async function removeNode({ accessToken, json, ...flags }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info(`Removing node`)

  const prompt = await inquirer.prompt([
    {
      name: 'nodeId',
      message: 'Enter the node id',
      type: 'text',
      validate: input => isFormatValid('node', input),
      when: () => !flags.nodeId
    },
    {
      name: 'yes',
      message: `You will remove the node. Do you want to continue?`,
      type: 'confirm',
      default: false,
      when: () => !flags.yes
    }
  ])

  const { yes, nodeId } = {
    ...flags,
    ...prompt
  }

  if (!nodeId) {
    formatErrorResponse(isJson, 'Missing node id')
    return
  }

  if (!yes) {
    formatResponse(isJson, 'Remove node cancelled')
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
