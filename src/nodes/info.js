'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
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
async function infoNode({ accessToken, nodeId }) {
  consola.info(`Retrieving node with ID ${nodeId}.`)

  if (!nodeId) {
    const prompt = await inquirer.prompt([
      { name: 'nodeId', message: 'Enter the node id', type: 'text' }
    ])
    nodeId = prompt.nodeId
    if (!nodeId) {
      return consola.error('Missing node id')
    }
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/nodes/${nodeId}`
  const spinner = ora().start()

  return request.get(
    url,
    { headers: { Authorization }, json: true },
    function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error retrieving the node: ${err}.`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      if (data.statusCode === 404) {
        return consola.error(
          'Error retrieving node information, requested resource not found'
        )
      }

      const { body } = data
      if (data.statusCode !== 200) {
        return consola.error(`Error retrieving the node: ${body.code}.`)
      }

      const {
        id,
        auth,
        state,
        chain,
        network,
        serviceData,
        ip,
        stoppedAt,
        createdAt
      } = body
      const creds =
        auth.type === 'jwt'
          ? '* Auth:\t\tJWT'
          : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

      process.stdout.write('\n')

      consola.success(`Retrieved node with id ${nodeId}
    * ID:\t\t${id}
    * Started At:\t${createdAt}
    * Stopped At:\t${stoppedAt || 'N/A'}
    * Chain:\t\t${chain}
    * Network:\t\t${network}
    * Version:\t\t${serviceData.software}
    * Performance:\t${serviceData.performance}
    * State:\t\t${state}
    * IP:\t\t${ip}
    ${creds}`)
    }
  )
}

module.exports = infoNode
