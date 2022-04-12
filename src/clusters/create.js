'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
const jwtDecode = require('jwt-decode')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

const CLUSTER_MIN_CAPACITY = 2
const CLUSTER_MAX_CAPACITY = 10

/**
 * Creates a cluster from a service ID (Admins only)
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.serviceId Service ID
 * @param {Object} params.authType Authentication type
 * @param {Object} params.capacity Clusters total capacity
 * @param {Object} params.onDemandCapacity Clusters on-demand capacity
 * @returns {Promise} The create cluster promise
 */
async function createCluster(params) {
  const { accessToken, authType, capacity, onDemandCapacity, serviceId } =
    params

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create clusters with the CLI')
  }

  if (!serviceId) {
    return consola.error('Missing service id value (-s or --serviceId)')
  }

  if (capacity < CLUSTER_MIN_CAPACITY || capacity > CLUSTER_MAX_CAPACITY) {
    return consola.error(
      `Wrong cluster capacity. Capacity should be between ${CLUSTER_MIN_CAPACITY} and ${CLUSTER_MAX_CAPACITY}`
    )
  }

  if (onDemandCapacity < 1 || onDemandCapacity > capacity) {
    return consola.error(
      `Wrong on-demand cluster capacity. Capacity should be between ${1} and ${capacity}`
    )
  }

  consola.info(`Creating a new cluster from service ${serviceId}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/clusters`
  const json = { serviceId, authType, capacity, onDemandCapacity }
  const spinner = ora().start()

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization
    },
    body: JSON.stringify(json)
  })
    .then(res => {
      spinner.stop()
      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status === 404) {
        return consola.error(
          'Error initializing the new cluster, requested resource not found'
        )
      }
      if (res.status !== 201) {
        return consola.error(
          `Error initializing the new cluster: ${res.status || res.statusText}`
        )
      }
      return res.json()
    })
    .then(res => {
      const creds =
        res.auth.type === 'jwt'
          ? `
    * Auth:\t\tJWT`
          : res.auth.type === 'basic'
          ? `
    * User:\t\t${res.auth.user}
    * Password:\t\t${res.auth.pass}`
          : `
    * Auth:\t\tnone`

      process.stdout.write('\n')
      consola.success(`Initialized new cluster from service ${serviceId}
    * ID:\t\t${res.id}
    * Name:\t\t${res.name}
    * Chain:\t\t${res.chain}
    * Network:\t\t${res.network}
    * Version:\t\t${res.serviceData.software}
    * Performance:\t${res.serviceData.performance}
    * Domain:\t\t${res.domain}
    * Capacity:\t\t${res.onDemandCapacity}:${res.capacity}
    * Region:\t\t${res.region}
    * State:\t\t${res.state}${creds}`)

      process.stdout.write('\n')
      coppyToClipboard(res.id, 'Cluster id')
    })
    .catch(err => consola.error(`Error initializing the new cluster: ${err}`))
}

module.exports = createCluster
