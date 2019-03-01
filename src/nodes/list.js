'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
require('console.table')

const { nodesUrl } = require('../config')

async function listNodes (user, accessToken, flags) {
  consola.info(`Retrieving all nodes node for user ${user}.`)

  const Authorization = `Bearer ${accessToken}`
  const url = `${nodesUrl}/nodes`
  const spinner = ora().start()

  request.get(url, { headers: { Authorization } }, function (err, data) {
    spinner.stop()
    if (err) {
      return consola.error(`Error retrieving all nodes: ${err}.`)
    }

    if (data.statusCode !== 200) {
      return consola.error(`Error retrieving all nodes: ${data.code}`)
    }

    let body = JSON.parse(data.body)
    body = body.map(function (n) {
      delete n.user
      delete n.instance
      n.PublicDnsName = n.vendor.PublicDnsName
      delete n.vendor
      return n
    })

    if (!flags.all) {
      body = body.filter(n => n.state !== 'stopped')
    }

    if (!body.length) {
      return consola.success(`No nodes were found for user ${user}`)
    }

    consola.success(`Got ${body.length} nodes:`)
    process.stdout.write('\n')
    console.table(body)
  })
}

module.exports = listNodes
