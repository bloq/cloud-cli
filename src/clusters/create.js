'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const jwtDecode = require('jwt-decode')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

/**
 * Creates a cluster from a service ID (Admins only)
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.serviceId Service ID
 * @param {Object} params.authType Authentication type
 * @returns {Promise} The create cluster promise
 */
async function createCluster ({ accessToken, serviceId, authType }) {
  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create clusters with the CLI')
  }

  if (!serviceId) {
    return consola.error('Missing service id value (-s or --serviceId)')
  }

  consola.info(`Creating a new cluster from service ${serviceId}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/clusters`
  const json = { serviceId, authType }
  const spinner = ora().start()

  return request.post(url, { headers: { Authorization }, json }, function (
    err,
    data
  ) {
    spinner.stop()
    if (err) {
      return consola.error(`Error initializing the new cluster: ${err}`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 404) {
      return consola.error(
        'Error initializing the new cluster, requested resource not found'
      )
    }

    const { body } = data

    if (data.statusCode !== 201) {
      return consola.error(`Error initializing the new cluster: ${body.code}`)
    }

    process.stdout.write('\n')

    coppyToClipboard(body.id, 'Cluster id')

    const creds =
      body.auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${body.auth.user}
    * Password:\t\t${body.auth.pass}`

    consola.success(`Initialized new cluster from service ${serviceId}
    * ID:\t\t${body.id}
    * Name:\t\t${body.name}
    * Chain:\t\t${body.chain}
    * Network:\t\t${body.network}
    * Version:\t\t${body.serviceData.software}
    * Performance:\t${body.serviceData.performance}
    * Domain:\t\t${body.domain}
    * Capacity:\t\t${body.capacity}
    * Region:\t\t${body.region}
    * State:\t\t${body.state}
    ${creds}`)
  })
}

module.exports = createCluster
