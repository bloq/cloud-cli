'use strict'

const consola = require('consola')
const lodash = require('lodash')
const ora = require('ora')
const fetch = require('node-fetch').default
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
  const spinner = ora().start()

  const params = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }

  fetch(url, params)
    .then(res => {
      spinner.stop()

      if (res.status === 401) {
        return consola.error('Your session has expired')
      }

      if (res.status === 403) {
        return consola.error('Permission denied')
      }

      if (res.status !== 200) {
        return consola.error(
          `Error retrieving all clusters: ${res.status || res.statusText}`
        )
      }

      return res.json()
    })
    .then(function (data) {
      let body = data
      if (!body) return
      if (!body.length) {
        const user = `${config.get('user')}`
        return consola.success(`No clusters were found for user ${user}`)
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
          name: alias || name,
          subdomain: name,
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
      return console.table(lodash.sortBy(body, sort.split(',') || 'createdAt'))
    })
    .catch(err => {
      spinner.stop()
      return consola.error(`Error retrieving alll clusters: ${err}`)
    })
}

module.exports = listClusters
