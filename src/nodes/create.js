/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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
    consola.error('Only admin users can create nodes with the CLI')
    return
  }

  if (!serviceId) {
    consola.error('Missing service id value (-s or --serviceId)')
    return
  }

  consola.info(`Initializing a new node from service ${serviceId}`)

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
  const json = { serviceId, authType }
  const body = JSON.stringify(json)

  return fetcher(url, 'POST', accessToken, body).then(res => {
    if (!res.ok) {
      if (res.status === 404) {
        consola.error(
          'Error initializing the new node, requested resource not found'
        )
        return
      }

      if (res.status !== 201) {
        consola.error(
          `Error initializing the new node: ${res.statusText || res.status}`
        )
        return
      }

      consola.error(`Error initializing the new node: ${res.status}`)
      return
    }

    const { id, auth, state, chain, network, serviceData, ip } = res.data

    const creds =
      auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

    coppyToClipboard(id, 'Node id')
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
  })
}

module.exports = createNode
