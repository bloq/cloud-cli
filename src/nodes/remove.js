'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
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

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`
  const spinner = ora().start()

  return request.del(
    url,
    { headers: { Authorization }, json: true },
    function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error removing the node: ${err}.`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      if (data.statusCode === 404) {
        return consola.error(
          'Error removing node, requested resource not found'
        )
      }

      const { body } = data
      if (data.statusCode !== 204) {
        return consola.error(`Error removing the node: ${body.code}`)
      }

      consola.success(`Node with id ${nodeId} removed successfully`)
    }
  )
}

module.exports = removeNode
