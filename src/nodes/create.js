/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const {
  fetcher,
  formatCredentials,
  formatOutput,
  formatErrorResponse
} = require('../utils')
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
async function createNode({ accessToken, serviceId, authType, json }) {
  const isJson = typeof json !== 'undefined'

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    formatErrorResponse(
      isJson,
      'Only admin users can create nodes with the CLI'
    )
    return
  }

  if (!serviceId) {
    formatErrorResponse(isJson, 'Missing service id value (-s or --serviceId)')
    return
  }

  !isJson && consola.info(`Initializing a new node from service ${serviceId}\n`)

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes`
  const jsonBody = { serviceId, authType }
  const body = JSON.stringify(jsonBody)

  return fetcher(url, 'POST', accessToken, body).then(res => {
    if (!res.ok) {
      if (res.status === 404) {
        formatErrorResponse(
          isJson,
          'Error initializing the new node, requested resource not found'
        )
        return
      }

      if (res.status !== 201) {
        formatErrorResponse(
          isJson,
          `Error initializing the new node: ${res.statusText || res.status}`
        )
        return
      }

      formatErrorResponse(
        isJson,
        `Error initializing the new node: ${res.status}`
      )
      return
    }

    const data = {
      id: res.data.id,
      chain: res.data.chain,
      network: res.data.network,
      version: res.data.serviceData.software,
      performance: res.data.serviceData.performance,
      state: res.data.state,
      ip: res.data.ip,
      ...formatCredentials(res.data.auth)
    }

    formatOutput(isJson, data)

    if (!isJson) {
      consola.success(`Initialized new node from service ${serviceId}\n`)
      coppyToClipboard(res.data.id, 'Node id')
    }
  })
}

module.exports = createNode
