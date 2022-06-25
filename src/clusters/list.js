'use strict'

const consola = require('consola')
const lodash = require('lodash')
const { fetcher } = require('../utils')
require('console.table')

const config = require('../config')

/**
 * Retrieves cluster
 *
 * @param {Object} params object
 * @param {string} params.accessToken Account access token
 * @param {boolean} params.all Flag defining if it should show killed clusters
 * @param {string} params.allClusters List clusters from all users
 * @param {string} params.sort Key used to sort the output

 * @returns {Promise} The information cluster promise
 */
async function listClusters({ accessToken, all, allClusters, sort }) {
  consola.info('Retrieving clusters...')

  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}${
    allClusters ? '/clusters' : '/users/me/clusters'
  }`

  return fetcher(url, 'GET', accessToken).then(res => {
    if (!res.ok) {
      consola.error(`Error retrieving all clusters: ${res.status}`)
      return
    }

    let body = res.data
    if (!body) {
      return
    }
    if (!body.length) {
      const user = `${config.get('user')}`
      consola.success(`No clusters were found for user ${user}`)
      return
    }

    body = body.map(function ({
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
    }) {
      const cluster = {
        id,
        chain,
        network,
        alias,
        name,
        state: state === 'started' && updatingService ? 'updating' : state,
        health: `${Math.round((healthCount / capacity) * 100)}%`,
        createdAt,
        version: serviceData.software,
        performance: serviceData.performance
      }

      if (all) {
        cluster.stoppedAt = stoppedAt
      }
      if (allClusters) {
        cluster.user = user.email
      }

      return cluster
    })

    if (!all) {
      body = body.filter(n => n.state !== 'stopped')
    }

    consola.success(`Got ${body.length} clusters:`)
    process.stdout.write('\n')
    // eslint-disable-next-line no-console
    console.table(lodash.sortBy(body, sort.split(',') || 'createdAt'))
  })
}

module.exports = listClusters
