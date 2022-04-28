'use strict'

const consola = require('consola')
const lodash = require('lodash')
const fetch = require('node-fetch').default
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

  const params = {
    method: 'GET'
  }

  fetch(url, params)
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving available services: ${
            res.statusText || res.status
          }.`
        )
      }

      return res.json()
    })
    .then(res => {
      let body = res

      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      return console.table(
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
    .catch(err => consola.error(`Error retrieving available services: ${err}.`))
}

module.exports = getServices
