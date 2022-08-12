'use strict'

const consola = require('consola')
const lodash = require('lodash')
const { fetcher, formatOutput, formatErrorResponse } = require('../utils')
require('console.table')

const config = require('../config')

/**
 *  Get all chains available
 *
 * @returns {Promise}
 */
async function getServices({ json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving list of available services.\n')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services/nodes`

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving available services: ${res.status}`
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
          performance: metadata.performance,
          region: vendor.region,
          id
        })),
      ['chain', 'network', 'software', 'performance', 'region']
    )

    formatOutput(isJson, data)
  })
}

module.exports = getServices
