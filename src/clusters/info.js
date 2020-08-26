'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

/**
 * Retrieves cluster information by ID
 *
 * @param {Object} params object
 * @param {Object} params.accessToken Account access token
 * @param {Object} params.clusterId Cluster ID
 * @returns {Promise} The information cluster promise
 */
async function infoCluster ({ accessToken, clusterId }) {
  consola.info('Retrieving cluster information')

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      { name: 'clusterId', message: 'Enter the cluster id', type: 'text' }
    ])
    clusterId = prompt.clusterId
    if (!clusterId) {
      return consola.error('Missing cluster id')
    }
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const serviceUrl = config.get(`services.${env}.nodes.url`)
  const url = `${serviceUrl}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  return request.get(url, { headers: { Authorization }, json: true }, function (
    err,
    data
  ) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving the cluster: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 404) {
      return consola.error(
        'Error retrieving cluster information, requested resource not found'
      )
    }

    const { body } = data

    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving the cluster: ${body.code}`)
    }

    const creds =
      body.auth.type === 'jwt'
        ? `
    * Auth:\t\tJWT`
        : body.auth.type === 'basic'
          ? `
    * User:\t\t${body.auth.user}
    * Password:\t\t${body.auth.pass}`
          : `
    * Auth:\t\tnone`

    process.stdout.write('\n')

    consola.success(`Retrieved cluster with id ${clusterId}
    * ID:\t\t${body.id}
    * Name:\t\t${body.name}
    * Chain:\t\t${body.chain}
    * Network:\t\t${body.network}
    * Version:\t\t${body.serviceData.software}
    * Performance:\t${body.serviceData.performance}
    * Domain:\t\t${body.domain}
    * Capacity:\t\t${body.onDemandCapacity}:${body.capacity}
    * Region:\t\t${body.region}
    * State:\t\t${body.state}${creds}`)
  })
}

module.exports = infoCluster
