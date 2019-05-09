'use strict'

const consola = require('consola')
const request = require('request')
const { Command } = require('@oclif/command')
const inquirer = require('inquirer')
const config = require('../config')

class UpdatePasswordCommand extends Command {
  async run () {
    const user = config.get('user')
    const accessToken = config.get('accessToken')

    if (!user || !accessToken) {
      return consola.error('User is not authenticated. Use login command to start a new session.')
    }

    const { oldPassword, newPassword, confirmPassword } = await inquirer.prompt([
      { name: 'oldPassword', message: 'Enter old password', type: 'password' },
      { name: 'newPassword', message: 'Enter new password', type: 'password' },
      { name: 'confirmPassword', message: 'Confirm new password', type: 'password' }
    ])

    if (oldPassword === newPassword) {
      return consola.error('New password must be different from old password')
    }

    if (newPassword !== confirmPassword) {
      return consola.error('The passwords you have entered do not match')
    }

    consola.info(`Updating password for user ${user}`)
    const Authorization = `Bearer ${accessToken}`
    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users/me/password`

    request.put(url, {
      headers: { Authorization },
      json: {
        newPassword,
        oldPassword
      }
    }, function (err, data) {
      if (err) {
        return consola.error(`Error updating user password: ${err}`)
      }

      if (data.statusCode === 400) {
        return consola.error(`Error updating user password: ${data.body.code}`)
      }

      if (data.statusCode !== 204) {
        return consola.error('Error updating user password.')
      }

      consola.success('User password updated')
    })
  }
}

UpdatePasswordCommand.description = 'Update user password'

module.exports = UpdatePasswordCommand
