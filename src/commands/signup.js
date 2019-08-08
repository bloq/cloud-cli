'use strict'

const ora = require('ora')
const consola = require('consola')
const request = require('request')
const inquirer = require('inquirer')
const countriesData = require('country-region-data')
const { Command } = require('@oclif/command')

const config = require('../config')
const {
  isEmailValid,
  isZipCodeValid,
  isNotEmpty,
  isPasswordValid
} = require('../validator')

/**
 *  Prompt password and password confirmation until they match
 *
 * @returns {Promise} password
 */
async function askForPassowords () {
  const { password, confirmPassword } = await inquirer.prompt([
    {
      name: 'password',
      message: 'Enter your password',
      type: 'password',
      validate: isPasswordValid
    },
    {
      name: 'confirmPassword',
      message: 'Confirm your password',
      type: 'password',
      validate: isNotEmpty
    }
  ])

  if (password !== confirmPassword) {
    consola.error('Passwords do not match')
    return askForPassowords()
  }

  return Promise.resolve(password)
}

class SignupCommand extends Command {
  async run () {
    consola.info('☁️  Welcome to BloqCloud!')
    consola.info('We will guide you to create your new account')

    config.delete('user')
    config.delete('accessToken')
    config.delete('clientToken')
    config.delete('clientId')
    config.delete('clientSecret')

    const { email, displayName } = await inquirer.prompt([
      { name: 'email', message: 'Enter your email address', type: 'input', validate: isEmailValid },
      { name: 'displayName', message: 'Enter your name', type: 'input', validate: isNotEmpty }
    ])

    const { address, countryName } = await inquirer.prompt([
      { name: 'address', message: 'Enter your street address', type: 'input', validate: isNotEmpty },
      {
        name: 'countryName',
        message: 'Select your country',
        type: 'rawlist',
        choices: countriesData.map(({ countryName }) => countryName),
        default: 234
      }
    ])

    const country = countriesData.find(c => c.countryName === countryName)

    const { regionName, zipCode } = await inquirer.prompt([
      {
        name: 'regionName',
        message: 'Select your state/province',
        type: 'rawlist',
        choices: country.regions.map(({ name }) => name),
        default: 234
      },
      {
        name: 'zipCode',
        message: 'Enter your zip code',
        type: 'input',
        validate: zipCode => isZipCodeValid(country.countryShortCode, zipCode)
      }
    ])

    const region = country.regions.find(r => r.name === regionName)

    const password = await askForPassowords()

    const { acceptTerms } = await inquirer.prompt([
      {
        name: 'acceptTerms',
        message: 'Use of Bloq’s services is subject to the Terms of Service found at https://bloq.cloud/legal \nPlease confirm that you have read and agree to the Terms of Service by selecting [“I accept”]',
        type: 'list',
        choices: ['Decline', 'I accept']
      }
    ])

    if (acceptTerms === 'Decline') {
      return consola.error('Terms & Conditions must be accepted in order to create a BloqCloud account and access BloqCloud services.') // eslint-disable-line
    }

    const env = config.get('env') || 'prod'
    const url = `${config.get(`services.${env}.accounts.url`)}/users`

    const { confirm } = await inquirer.prompt([
      { name: 'confirm', message: 'Please check that your information is correct. Do you want to continue?', type: 'confirm' } // eslint-disable-line
    ])

    if (!confirm) {
      return consola.error('BloqCloud signup aborted')
    }

    const body = {
      json: {
        email,
        displayName,
        password,
        billingAddress: {
          address,
          zipCode,
          state: region.shortCode,
          country: country.countryShortCode
        }
      }
    }

    consola.info('Creating your new BloqCloud account')
    const spinner = ora().start()

    request.post(url, body, function (err, data) {
      spinner.stop()
      if (err) {
        return consola.error(`Error creating BloqCloud account: ${err}`)
      }

      if (data.statusCode !== 201) {
        return consola.error(
          `Error creating BloqCloud account: ${data.body.code || data.body.message}`
        )
      }

      consola.success('Generated new BloqCloud account')
      consola.info(`Email sent to ${email} confirm your account.`)
    })
  }
}

SignupCommand.description = 'Setup a new BloqCloud account'

module.exports = SignupCommand
