'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const config = require('../config')

/**
 * Retrieves chains
 *
 * @returns {Promise} The chains promise
 */
async function getChains() {
  consola.info('Retrieving list of available blockchains.')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/chains/cluster`
  const spinner = ora().start()

  return request.get(url, { json: true }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving available blockchains: ${err}.`)
    }

    if (data.statusCode === 401) {
      return consola.error('Unauthorized')
    }

    if (data.statusCode === 403) {
      return consola.error('Your session has expired', data)
    }

    const { body } = data
    if (data.statusCode !== 200) {
      return consola.error(
        `Error retrieving available blockchains: ${body.code}`
      )
    }

    process.stdout.write('\n')
    console.table(body)

    return body
  })
}

module.exports = getChains
