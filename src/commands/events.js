'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const config = require('../config')
require('console.table')

class EventsCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    consola.info(`Retrieving events for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const url = `${config.get('services.accounts.url')}/events`
    const spinner = ora().start()

    request.get(url, { headers: { Authorization } }, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error retrieving events: ${err}`)
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error retrieving events: ${body.code}`)
      }

      consola.success(`Retrieved ${body.length} events:`)
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

EventsCommand.description = 'Get BloqCloud events'

module.exports = EventsCommand
