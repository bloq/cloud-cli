'use strict'

const Conf = require('conf')
const config = new Conf()

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
require('console.table')

const { accountsUrl } = require('../config')

class EventsCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated, use login command to start a new session.')
    }

    consola.info(`Getting events for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const url = `${accountsUrl}/events`

    request.get(url, { headers: { Authorization } }, function (err, data) {
      if (err) {
        return consola.error(`Error trying to get events: ${err}`)
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error trying to get events: ${body.code}`)
      }

      consola.success(`Got ${body.length} events:`)
      process.stdout.write('\n')
      console.table(body.map(function ({ service, serviceData, createdAt }) {
        return {
          service,
          serviceData: JSON.stringify(serviceData),
          createdAt
        }
      }))
    })
  }
}

EventsCommand.description = 'gets bloq cloud events'

module.exports = EventsCommand
