'use strict'

const consola = require('consola')
const lodash = require('lodash')
const { fetcher, formatResponse } = require('../utils')
require('console.table')

const config = require('../config')

/**
 * Retrieves cluster associated services
 *
 * @param {Object} params object
 * @param {string} params.sort Key used to sort the output
 * @returns {Promise} The services promise
 */
async function getServices({ sort, json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving list of available services')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services/cluster`

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      formatResponse(isJson, `Error retrieving all services: ${res.message}`)
      return
    }

    const data = res.data

    if (isJson) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(
      lodash.sortBy(
        data
          .filter(s => !s.disabled)
          .map(({ chain, id, metadata, vendor, network }) => ({
            chain,
            network,
            software: metadata.software,
            performance: metadata.performance,
            region: vendor.region,
            id
          })),
        (sort && sort.split(',')) || [
          'chain',
          'network',
          'software',
          'performance',
          'region'
        ]
      )
    )
  })
}

module.exports = getServices
