'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')

const { nodesUrl } = require('../config')

async function createNode (user, accessToken, chain) {
  consola.info(`Initializing a new ${chain} node for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes`
  const json = { image: chain }
  const spinner = ora().start()

  request.post(url, { headers: { Authorization }, json }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error initializing a new ${chain} node: ${err}`)
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error initializing a new ${chain} node: ${data.code}`)
    }

    const { id, state, instance } = data.body
    process.stdout.write('\n')

    consola.success(`Initalized new ${chain} node
    * ID:\t${id}
    * State:\t${state}
    * Vendor:\t${instance.vendor}
    * ${instance.vendor.toUpperCase()} ID:\t${instance.id}
    * Type:\t${instance.type}
    * Image ID:\t${instance.imageId}
    `)
  })
}

module.exports = createNode
