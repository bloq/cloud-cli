'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

/**
 *  Get all chains available
 *
 * @returns {Promise}
 */
async function chainsNodes () {
  consola.info('Retrieving list of available services.')

  // const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/services`
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
      return consola.error(
        `Error retrieving available services: ${body.code}`
      )
    }

    process.stdout.write('\n')
    console.table(body.map(({ chain, id, metadata, vendor, network }) => ({
      chain,
      network,
      software: metadata.software,
      performance: metadata.performance,
      region: vendor.region,
      id
    })))

    return body
  })
}

module.exports = chainsNodes
