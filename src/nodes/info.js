'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
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

      if (res.status === 404) {
        return consola.error(
          'Error retrieving node information, requested resource not found'
        )
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving the node: ${res.statusText || res.status}.`
        )
      }

      return res.json()
    })
    .then(res => {
      let body = res
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
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error retrieving the node: ${err}.`)
    })
}

module.exports = infoNode
