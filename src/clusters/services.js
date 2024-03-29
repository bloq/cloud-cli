'use strict'

const consola = require('consola')
const lodash = require('lodash')
const { fetcher, formatErrorResponse, formatOutput } = require('../utils')
require('console.table')

const config = require('../config')
const accessToken = config.get('accessToken')

/**
 * Retrieves cluster associated services
 *
 * @param {Object} params object
 * @param {string} params.sort Key used to sort the output
 * @returns {Promise} The services promise
 */
async function getServices({ sort, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving list of available services\n')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services/cluster`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving all services: ${res.message}`
      )
      return
    }

    const data = lodash.sortBy(
      res.data
        .filter(s => !s.disabled)
        .map(({ chain, id, metadata, vendor, network }) => ({
          chain,
          network,
          software: metadata.software,
          amiPrefix: metadata.amiPrefix,
          performance: metadata.performance,
          region: vendor.region,
          id
        })),
      sort
        ? sort.split(',')
        : ['chain', 'network', 'software', 'performance', 'region']
    )

    formatOutput(isJson, data)
  })
}

module.exports = getServices
