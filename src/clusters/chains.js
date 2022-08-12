'use strict'

const consola = require('consola')
const { fetcher, formatErrorResponse, formatOutput } = require('../utils')
require('console.table')

const config = require('../config')

/**
 * Retrieves chains
 *
 * @returns {Promise} The chains promise
 */
async function getChains({ json }) {
  const isJson = typeof json !== 'undefined'

  !isJson && consola.info('Retrieving list of available blockchains.\n')

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

    const data = res.data.map(({ chain, network, software }) => ({
      chain,
      network,
      software
    }))

    formatOutput(isJson, data)
  })
}

module.exports = getChains
