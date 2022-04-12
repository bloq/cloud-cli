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
  const url = `${config.get(`services.${env}.nodes.url`)}/chains/nodes`
  const spinner = ora().start()

  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401 || res.status === 403) {
        return consola.error('Your session has expired')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving available blockchains: ${
            res.statusText || res.status
          }`
        )
      }
      return res.json()
    })
    .then(res => {
      process.stdout.write('\n')
      // eslint-disable-next-line no-console
      console.table(res)

      return res
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error retrieving available blockchains: ${err}.`)
    })
}

module.exports = getChains
