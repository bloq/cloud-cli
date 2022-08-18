/* eslint-disable consistent-return */
'use strict'

const consola = require('consola')
const {
  fetcher,
  formatErrorResponse,
  formatCredentials,
  formatOutput
} = require('../utils')
const { isFormatValid } = require('../validator')
const inquirer = require('inquirer')
const config = require('../config')

/**
 * Retrieves cluster information by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.clusterId Cluster ID
 * @returns {Promise} The information cluster promise
 */
async function infoCluster({ accessToken, clusterId, json }) {
  const isJson = typeof json !== 'undefined'

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      {
        name: 'clusterId',
        message: 'Enter the cluster id',
        type: 'text',
        validate: input => isFormatValid('cluster', input)
      }
    ])
    // eslint-disable-next-line no-param-reassign
    clusterId = prompt.clusterId
    if (!clusterId) {
      formatErrorResponse(isJson, 'Missing cluster id')
      return
    }
  }

  !isJson && consola.info('Retrieving cluster information\n')

  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/clusters/${clusterId}`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(isJson, `Error retrieving cluster: ${res.status}`)
      return
    }

    const getState = body =>
      body.state === 'started' && body.updatingService ? 'updating' : body.state

    const data = {
      id: res.data.id,
      name: res.data.name,
      alias: res.data.alias,
      chain: res.data.chain,
      network: res.data.network,
      version: res.data.serviceData.software,
      performance: res.data.serviceData.performance,
      domain: res.data.domain,
      capacity: res.data.capacity,
      region: res.data.region,
      state: `${getState(res.data)}`,
      ...formatCredentials(res.data.auth)
    }

    formatOutput(isJson, data)
  })
}

module.exports = infoCluster
