'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const jwtDecode = require('jwt-decode')

const config = require('../config')

/**
 *  Get the information of the given cluster
 *
 * @param  {Object} options { accessToken, clusterId }
 * @returns {Promise}
 */
async function removeCluster ({ accessToken, clusterId }) {
  consola.info(`Removing cluster with id ${clusterId}.`)

  const payload = jwtDecode(accessToken)
  if (!payload.aud.includes('manager')) {
    return consola.error('Only admin users can create clusters with the CLI')
  }

  if (!clusterId) {
    const prompt = await inquirer.prompt([
      { name: 'clusterId', message: 'Enter the cluster id', type: 'text' }
    ])

    clusterId = prompt.clusterId
    if (!clusterId) {
      return consola.error('Missing cluster id')
    }
  }

  const { confirmation } = await inquirer.prompt([
    {
      name: 'confirmation',
      message: `You will remove the cluster with id ${clusterId}. Do you want to continue?`,
      type: 'confirm',
      default: false
    }
  ])

  if (!confirmation) {
    return consola.error('Remove cluster was canceled.')
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(
    `services.${env}.nodes.url`
  )}/users/me/clusters/${clusterId}`
  const spinner = ora().start()

  return request.del(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error removing the cluster: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 204) {
      const body = JSON.parse(data.body)
      return consola.error(`Error removing the cluster: ${body.code}.`)
    }

    consola.success(`Removed cluster with id ${clusterId}`)
  })
}

module.exports = removeCluster
