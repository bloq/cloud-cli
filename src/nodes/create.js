'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const jwtDecode = require('jwt-decode')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

/**
 *  Creates a new node from a service (only valid for admin users)
 *
 * @param  {Object} options { accessToken, serviceId, authType }
 * @returns {Promise}
 */
async function createNode ({ accessToken, serviceId, authType }) {
  consola.info(`Initializing a new node from service ${serviceId}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
  const json = { serviceId, authType }
  const spinner = ora().start()

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create nodes with the CLI')
  }

  return request.post(url, { headers: { Authorization }, json }, function (
    err,
    data
  ) {
    spinner.stop()
    if (err) {
      return consola.error(`Error initializing the new node: ${err}`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error initializing the new node: ${data.code}`)
    }

    const { id, auth, state, chain, network, serviceData, ip } = data.body
    process.stdout.write('\n')

    coppyToClipboard(id, 'Node id')

    const creds =
      auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

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
