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
async function getChains () {
  consola.info('Retrieving list of available blockchains.')

  // const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/chains`
  const spinner = ora().start()

  return request.get(url, {}, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving available blockchains: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
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
