'use strict'
const stringEntropy = require('fast-password-entropy')
const config = require('./config')

const MIN_ENTROPY = config.get('passwordEntropy')

function isUserValid (user) {
  const USER_REGEX = /user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (USER_REGEX.test(user)) { return true }

  return 'The user id does not have the correct format.'
}

function isUuidValid (uuid) {
  const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (UUID_REGEX.test(uuid)) { return true }

  return 'The token does not have the correct format.'
}

function isEmailValid (email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
  if (regex.test(String(email).toLowerCase())) { return true }

  return 'The email is not valid.'
}

function isNotEmpty (value) {
  if (value === '' || value === undefined || value === null) { return `The value can not be empty` }

  return true
}

function isPasswordValid (value) {
  let passwordEntropy = stringEntropy(value)
  if (passwordEntropy < MIN_ENTROPY) {
    return `The password provided is not strong enough. The password rate is ${ ((passwordEntropy * 100) / MIN_ENTROPY).toFixed() } and you need to reach 100, try adding more or different characters.`
  }

  return true
}

function isPasswordEqual (password1, password2) {
  if (password1 === password2) { return true }

  return 'Passwords do not match.'
}

function isAccepted (value) {
  if (value === 'I accept') { return true }

  return 'Terms & Conditions must be accepted in order to create a BloqCloud account and access BloqCloud services.'
}

module.exports = {
  isUserValid,
  isUuidValid,
  isEmailValid,
  isNotEmpty,
  isPasswordEqual,
  isPasswordValid,
  isAccepted
}
