'use strict'

const ora = require('ora')
const consola = require('consola')
const fetch = require('node-fetch').default
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

  const params = {
    method: 'GET'
  }

  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401) {
        return consola.error('Unauthorized')
      }

      if (res.status === 403) {
        return consola.error('Your session has expired', res.status)
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving available blockchains: ${
            res.status || res.statusText
          }.`
        )
      }

      return res.json()
    })
    .then(data => {
      // eslint-disable-next-line no-console
      return console.table(data)
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error retrieving available blockchains: ${err}.`)
    })
}

module.exports = getChains
