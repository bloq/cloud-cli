'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const { Command, flags } = require('@oclif/command')
const config = require('../config')
require('console.table')

class EventsCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')
    const { flags } = this.parse(EventsCommand)

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    consola.info(`Retrieving events for user ${user}`)

    const Authorization = `Bearer ${accessToken}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me/events`
    const spinner = ora().start()

    request.get(url, { headers: { Authorization } }, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error retrieving events: ${err}`)
      }

      if (data.statusCode === 401 || data.statusCode === 403) {
        return consola.error('Your session has expired')
      }

      const body = JSON.parse(data.body)
      if (data.statusCode !== 200) {
        return consola.error(`Error retrieving events: ${body.code}`)
      }

      let events = (body.map(function ({ id, service, serviceData, createdAt }) {
        return { id, service, serviceData: JSON.stringify(serviceData), createdAt }
      }))

      if (flags.service) {
        events = events.filter(e => e.service.toLowerCase().includes(flags.service))
      }

      consola.success(`Retrieved ${events.length} events:`)
      process.stdout.write('\n')
      console.table(events)
    })
  }
}

EventsCommand.description = 'Get Bloq daily events'

EventsCommand.flags = {
  service: flags.string({ char: 's', description: 'service name' })
}

module.exports = EventsCommand
