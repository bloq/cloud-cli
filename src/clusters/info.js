'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

/**
 *  Get the information of the given cluster
 *
 * @param  {Object} options { accessToken, clusterId }
 * @returns {Promise}
 */
async function infoCluster ({ accessToken, clusterId }) {
  consola.info(`Retrieving cluster with ID ${clusterId}.`)

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
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  return request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving the cluster: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving the cluster: ${body.code}.`)
    }

    const {
      id,
      auth,
      state,
      chain,
      network,
      serviceData,
      ip,
      stoppedAt,
      createdAt
    } = body
    const creds =
      auth.type === 'jwt'
        ? '* Auth:\t\tJWT'
        : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

    process.stdout.write('\n')

    consola.success(`Retrieved cluster with id ${clusterId}
    * ID:\t\t${id}
    * Started At:\t${createdAt}
    * Stopped At:\t${stoppedAt || 'N/A'}
    * Chain:\t\t${chain}
    * Network:\t\t${network}
    * Version:\t\t${serviceData.software}
    * Performance:\t${serviceData.performance}
    * State:\t\t${state}
    * IP:\t\t${ip}
    ${creds}`)
  })
}

module.exports = infoCluster
