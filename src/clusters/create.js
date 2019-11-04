'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const jwtDecode = require('jwt-decode')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

/**
 *  Creates a new cluster from a service (only valid for admin users)
 *
 * @param  {Object} options { accessToken, serviceId, authType }
 * @returns {Promise}
 */
async function createCluster ({ accessToken, serviceId, authType }) {
  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create clusters with the CLI')
  }

  if (!serviceId) {
    return consola.error('Missing service id value (-s or --serviceId)')
  }

  consola.info(`Initializing a new cluster from service ${serviceId}.`)

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

    if (data.statusCode !== 200) {
      return consola.error(`Error initializing the new cluster: ${data.code}`)
    }

    const { id, auth, state, chain, network, serviceData, ip } = data.body
    process.stdout.write('\n')

    coppyToClipboard(id, 'Cluster id')

    const creds =
      auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

    consola.success(`Initialized new cluster from service ${serviceId}
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

module.exports = createCluster
