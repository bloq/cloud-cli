'use strict'

const consola = require('consola')
const lodash = require('lodash')
const { fetcher } = require('../utils')
require('console.table')

const config = require('../config')

/**
 *  Get all chains available
 *
 * @returns {Promise}
 */
async function getServices() {
  consola.info('Retrieving list of available services.')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services/nodes`

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      consola.error(`Error retrieving available services: ${res.status}`)
      return
    }
    let body = res.data

    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(
      lodash.sortBy(
        body
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
    )
  })
}

module.exports = getServices
