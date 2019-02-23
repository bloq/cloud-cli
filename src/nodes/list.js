'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const { nodesUrl } = require('../config')

async function listNodes (user, accessToken) {
  consola.info(`Getting all nodes node for user ${user}.`)
  const spinner = ora().start()

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes`

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error trying to get all nodes: ${err}.`)
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error trying to get all nodes: ${data.code}`)
    }

    let body = JSON.parse(data.body)
    body = body.map(function (n) {
      delete n.user
      delete n.instance
      delete n.vendor
      return n
    })

    consola.success(`Got ${body.length} nodes:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listNodes
