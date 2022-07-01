/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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
 * @param {Object} params.alias Clusters alias

* @returns {Promise} The create cluster promise
 */
async function createCluster(params) {
  const {
    accessToken,
    authType,
    capacity,
    onDemandCapacity,
    serviceId,
    alias
  } = params

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    consola.error('Only admin users can create clusters with the CLI')
    return
  }

  if (!serviceId) {
    consola.error('Missing service id value (-s or --serviceId)')
    return
  }

  if (capacity < CLUSTER_MIN_CAPACITY || capacity > CLUSTER_MAX_CAPACITY) {
    consola.error(
      `Wrong cluster capacity. Capacity should be between ${CLUSTER_MIN_CAPACITY} and ${CLUSTER_MAX_CAPACITY}`
    )
    return
  }

  if (onDemandCapacity < 1 || onDemandCapacity > capacity) {
    consola.error(
      `Wrong on-demand cluster capacity. Capacity should be between ${1} and ${capacity}`
    )
    return
  }

  consola.info(`Creating a new cluster from service ${serviceId}.`)

  const json = { serviceId, authType, capacity, onDemandCapacity, alias }
  const body = JSON.stringify(json)
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/clusters`

  return fetcher(url, 'POST', accessToken, body).then(res => {
    if (!res.ok) {
      consola.error(
        `Error initializing the new cluster: ${res.message || res.status}`
      )
      return
    }

    const data = res.data
    const creds =
      data.auth.type === 'jwt'
        ? `
    * Auth:\t\tJWT`
        : data.auth.type === 'basic'
        ? `
    * User:\t\t${data.auth.user}
    * Password:\t\t${data.auth.pass}`
        : `
    * Auth:\t\tnone`

    process.stdout.write('\n')
    consola.success(`Initialized new cluster from service ${serviceId}
    * ID:\t\t${data.id}
    * Name:\t\t${data.name}
    * Alias:\t\t${data.alias || ''}
    * Chain:\t\t${data.chain}
    * Network:\t\t${data.network}
    * Version:\t\t${data.serviceData.software}
    * Performance:\t${data.serviceData.performance}
    * Domain:\t\t${data.domain}
    * Capacity:\t\t${data.onDemandCapacity}:${data.capacity}
    * Region:\t\t${data.region}
    * State:\t\t${data.state}${creds} \n`)
    coppyToClipboard(data.id, 'Cluster id')
  })
}

module.exports = createCluster
