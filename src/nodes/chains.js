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
  const url = `${config.get(`services.${env}.nodes.url`)}/chains/nodes`

  return fetcher(url, 'GET').then(res => {
    if (!res.ok) {
      formatErrorResponse(
        isJson,
        `Error retrieving available blockchains: ${res.status}`
      )
      return
    }

    if (isJson) {
      formatResponse(isJson, res.data)
      return
    }

    const data = res.data
    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(data)
  })
}

module.exports = getChains
