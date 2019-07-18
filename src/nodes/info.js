'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')

const config = require('../config')

/**
 *  Get the information of the given node
 *
 * @param  {object} options { accessToken, nodeId }
 * @returns {Promise}
 */
async function infoNode ({ accessToken, nodeId }) {
  consola.info(`Retrieving node with ID ${nodeId}.`)

  if (!nodeId) {
    const prompt = await inquirer.prompt([{ name: 'nodeId', message: 'Enter the node id', type: 'text' }])
    nodeId = prompt.nodeId
    if (!nodeId) { return consola.error('Missing node id') }
  }

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/users/me/nodes/${nodeId}`
  const spinner = ora().start()

  return request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving the node: ${err}.`)
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    const body = JSON.parse(data.body)
    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving the node: ${body.code}.`)
    }

    const { id, auth, state, chain, network, serviceData, ip, stoppedAt, createdAt } = body
    const creds = auth.type === 'jwt'
      ? '* Auth:\t\tJWT'
      : `* User:\t\t${auth.user}
    * Password:\t\t${auth.pass}`

    process.stdout.write('\n')

    consola.success(`Retrieved node with id ${nodeId}
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

module.exports = infoNode
