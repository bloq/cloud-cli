'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')

const config = require('../config')
const { coppyToClipboard } = require('../utils')

async function createNode (clientId, accessToken, { chain, large, jwt }) {
  consola.info(`Initializing a new ${chain} node with client ID ${clientId}.`)

  const Authorization = `Bearer ${accessToken}`
  const env = config.get('env') || 'prod'
  const url = `${config.get(`services.${env}.nodes.url`)}/nodes`
  const json = { image: chain, large, jwt }
  const spinner = ora().start()

  request.post(url, { headers: { Authorization }, json }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error initializing a new ${chain} node: ${err}`)
    }

    if (data.statusCode === 403 && data.body.code === 'LimitExceeded') {
      return consola.error('Maximum simultaneous number of nodes reached')
    }

    if (data.statusCode === 401 || data.statusCode === 403) {
      return consola.error('Your session has expired')
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error initializing a new ${chain} node: ${data.code}`)
    }

    const { id, version, state, nodeUser, nodePass, instance } = data.body
    process.stdout.write('\n')

    coppyToClipboard(id, 'Node id')

    const creds = nodeUser === '-' ?
    '' : `* NodeUser:\t${nodeUser}
    * NodePass:\t${nodePass}`

    consola.success(`Initialized new ${chain} node
    * ID:\t${id}
    * Version:\t${version}
    * State:\t${state}
    * Vendor:\t${instance.vendor}
    * Type:\t${instance.type}
    ${creds}`)
  })
}

module.exports = createNode
