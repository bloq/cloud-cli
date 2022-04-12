'use strict'

const ora = require('ora')
const consola = require('consola')
const lodash = require('lodash')
const fetch = require('node-fetch').default
require('console.table')

const config = require('../config')

/**
 * Retrieves cluster associated services
 *
 * @param {Object} params object
 * @param {string} params.sort Key used to sort the output
 * @returns {Promise} The services promise
 */
async function getServices({ sort }) {
  consola.info('Retrieving list of available services')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services/cluster`
  const spinner = ora().start()

  const params = {
    method: 'GET'
  }

  return fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.statusCode === 401 || res.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving available services: ${res.status}`
        )
      }

      return res.json()
    })
    .then(res => {
      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      console.table(
        lodash.sortBy(
          res
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

      return res
    })
    .catch(err => consola.error(`Error retrieving available services: ${err}.`))
}

module.exports = getServices
