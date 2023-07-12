'use strict'

require('console.table')

const consola = require('consola')
const lodash = require('lodash')

const {
  fetcher,
  formatErrorResponse,
  formatOutput,
  getArchiveStatus,
  getClientVersion
} = require('../utils')
const config = require('../config')

/**
 * Retrieves cluster
 *
 * @param {Object} params object
 * @param {string} params.accessToken Account access token
 * @param {boolean} [params.all] Flag defining if it should show killed clusters
 * @param {string} [params.allClusters] List clusters from all users
 * @param {string} [params.json] Format output as JSON
 * @param {string} [params.sort] Key used to sort the output

 * @returns {Promise} The information cluster promise
 */
function listClusters({ accessToken, all, allClusters, sort, json }) {
  const isJson = typeof json !== 'undefined'
  !isJson && consola.info('Retrieving clusters...')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}${
    allClusters ? '/clusters' : '/users/me/clusters'
  }`

  return fetcher(url, 'GET', accessToken)
    .then(res => {
      if (!res.ok) {
        formatErrorResponse(
          isJson,
          `Error retrieving all clusters: ${res.status}`
        )
        return
      }

      const { data } = res
      if (!data) {
        return
      }
      if (!data.length) {
        const user = `${config.get('user')}`
        formatErrorResponse(isJson, `No clusters were found for user ${user}`)
        return
      }

      // eslint-disable-next-line consistent-return
      return Promise.all(
        data.map(clusterRow =>
          Promise.all([
            getClientVersion(clusterRow).catch(() => 'error'),
            getArchiveStatus(clusterRow)
          ]).then(function ([clientVersion, archive]) {
            const {
              alias,
              capacity,
              chain,
              createdAt,
              healthCount = 0,
              id,
              name,
              network,
              serviceData = {},
              state,
              stoppedAt,
              updatingService,
              user
            } = clusterRow

            const cluster = {
              id,
              'alias/name': alias ? `${alias} (${name})` : name,
              chain,
              network,
              'version': `${
                clientVersion && clientVersion !== 'error'
                  ? clientVersion
                  : serviceData.software
              }${archive !== null ? ` (${archive ? 'archive' : 'full'})` : ''}`,
              'performance': serviceData.performance,
              'cap': capacity,
              'state':
                state === 'started' && updatingService ? 'updating' : state,
              'health': `${Math.round((healthCount / capacity) * 100)}%`,
              createdAt
            }

            if (all) {
              cluster.stoppedAt = stoppedAt
            }
            if (allClusters) {
              cluster.user = user.email
            }
            return cluster
          })
        )
      )
    })
    .then(function (clusters) {
      const body = all ? clusters : clusters.filter(n => n.state !== 'stopped')

      !isJson && consola.success(`Got ${body.length} clusters:\n`)
      formatOutput(
        isJson,
        lodash.sortBy(body, sort ? sort.split(',') : 'createdAt')
      )
    })
}

module.exports = listClusters
