'use strict'

const ora = require('ora')
const consola = require('consola')
const lodash = require('lodash')
const request = require('request')
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
  const spinner = ora().start()

  return request.get(url, {}, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving available services: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving available services: ${body.code}`)
    }

    process.stdout.write('\n')
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

    return body
  })
}

module.exports = getServices
