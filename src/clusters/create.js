/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const {
  fetcher,
  formatErrorResponse,
  formatCredentials,
  formatOutput
} = require('../utils')
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
    alias,
    json
  } = params

  const isJson = typeof json !== 'undefined'

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    formatErrorResponse(
      isJson,
      'Only admin users can create clusters with the CLI'
    )
    return
  }

  if (!serviceId) {
    formatErrorResponse(isJson, 'Missing service id value (-s or --serviceId)')
    return
  }

  if (capacity < CLUSTER_MIN_CAPACITY || capacity > CLUSTER_MAX_CAPACITY) {
    formatErrorResponse(
      isJson,
      `Wrong cluster capacity. Capacity should be between ${CLUSTER_MIN_CAPACITY} and ${CLUSTER_MAX_CAPACITY}`
    )
    return
  }

  if (onDemandCapacity < 1 || onDemandCapacity > capacity) {
    formatErrorResponse(
      isJson,
      `Wrong cluster capacity. Capacity should be between ${CLUSTER_MIN_CAPACITY} and ${CLUSTER_MAX_CAPACITY}`
    )
    return
  }

  !isJson && consola.info(`Creating a new cluster from service ${serviceId}.\n`)

  const jsonBody = { serviceId, authType, capacity, onDemandCapacity, alias }
  const body = JSON.stringify(jsonBody)
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/clusters`

  return fetcher(url, 'POST', accessToken, body).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error initializing the new cluster: ${res.message || res.status}`
      )
      return
    }

    const data = {
      id: res.data.id,
      name: res.data.name,
      alias: res.data.alias,
      chain: res.data.chain,
      network: res.data.network,
      version: res.data.serviceData.software,
      performance: res.data.serviceData.performance,
      domain: res.data.domain,
      capacity: `${res.data.onDemandCapacity}:${res.data.capacity}`,
      region: res.data.region,
      state: res.data.state,
      ...formatCredentials(res.data.auth)
    }

    formatOutput(isJson, data)

    if (!isJson) {
      consola.success(`Initialized new cluster from service ${serviceId}\n`)
      coppyToClipboard(data.id, 'Cluster id')
    }
  })
}

module.exports = createCluster
