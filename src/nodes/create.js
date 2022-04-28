'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
const jwtDecode = require('jwt-decode')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

/**
 * Creates a node from a service ID (Valid for admin users)
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.serviceId Service ID
 * @param {Object} params.authType Authentication type
 * @returns {Promise} The create node promise
 */
async function createNode({ accessToken, serviceId, authType }) {
  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create nodes with the CLI')
  }

  if (!serviceId) {
    return consola.error('Missing service id value (-s or --serviceId)')
  }

  consola.info(`Initializing a new node from service ${serviceId}`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
  const json = { serviceId, authType }
  const spinner = ora().start()

  const params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization
    },
    body: JSON.stringify(json)
  }

  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status === 404) {
        return consola.error(
          'Error initializing the new node, requested resource not found'
        )
      }

      if (res.status !== 201) {
        return consola.error(
          `Error initializing the new node: ${res.statusText || res.status}`
        )
      }

      return res.json()
    })
    .then(res => {
      const { id, auth, state, chain, network, serviceData, ip } = res

      const creds =
        auth.type === 'jwt'
          ? '* Auth:\t\tJWT'
          : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

      process.stdout.write('\n')
      consola.success(`Initialized new node from service ${serviceId}
    * ID:\t\t${id}
    * Chain:\t\t${chain}
    * Network:\t\t${network}
    * Version:\t\t${serviceData.software}
    * Performance:\t${serviceData.performance}
    * State:\t\t${state}
    * IP:\t\t${ip}
    ${creds}`)

      process.stdout.write('\n')
      coppyToClipboard(id, 'Node id')
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error initializing the new node: ${err}`)
    })
}

module.exports = createNode
