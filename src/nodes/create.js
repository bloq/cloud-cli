'use strict'

const consola = require('consola')
const request = require('request')

const { nodesUrl } = require('../config')

async function createNode (user, accessToken, chain) {
  consola.info(`Creating a new ${chain} node for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes`
  const json = { image: chain }

  request.post(url, { headers: { Authorization }, json }, function (err, data) {
    if (err) {
      return consola.error(`Error trying to create a new ${chain} node: ${err}.`)
    }

    const { id, state, instance } = data.body
    process.stdout.write('\n')
    consola.success(`Created new ${chain} node
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
