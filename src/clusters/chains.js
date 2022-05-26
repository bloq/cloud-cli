'use strict'

const consola = require('consola')
const { fetcher } = require('../utils')
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

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      consola.error(`Error retrieving available blockchains: ${res.message}`)
      return
    }
    // eslint-disable-next-line no-console
    console.table(res.data)
  })
}

module.exports = getChains
