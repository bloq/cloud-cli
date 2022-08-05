'use strict'

const consola = require('consola')
const { fetcher, formatResponse, formatErrorResponse } = require('../utils')
require('console.table')

const config = require('../config')

/**
 * Retrieves chains
 *
 * @returns {Promise} The chains promise
 */
async function getChains({ json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving list of available blockchains.')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/chains/cluster`

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving available blockchains: ${res.message}`
      )
      return
    }

    if (isJson) {
      const data = res.data.map(({ chain, network, software }) => ({
        chain,
        network,
        software
      }))
      formatResponse(isJson, data)
      return
    }

    // eslint-disable-next-line no-console
    console.table(res.data)
  })
}

module.exports = getChains
