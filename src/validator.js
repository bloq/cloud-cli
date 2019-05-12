'use strict'
const stringEntropy = require('fast-password-entropy')
const config = require('./config')

const MIN_ENTROPY = config.get('passwordEntropy')
const CHAIN_OPTIONS = ['btc', 'bch', 'eth']

/**
 *  Check if an email is valid or not
 *
 * @param  {string} email the email address
 * @returns {boolean|string} string with error message or true
 */
function isEmailValid (email) {
  // eslint-disable-next-line max-len
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
  if (EMAIL_REGEX.test(String(email).toLowerCase())) { return true }

  return 'The email is not valid.'
}

/**
 *  Check if the user is valid or not
 *
 * @param  {string} user the user email or id
 * @returns {boolean|string} string with error message or true
 */
function isUserValid (user) {
  // eslint-disable-next-line max-len
  const USER_REGEX = /user-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (USER_REGEX.test(user)) { return true }

  const emailValidation = isEmailValid(user)
  if (typeof emailValidation === 'boolean') { return true }

  return 'The email or account id does not have the correct format.'
}

/**
 *  Check if a uuid is valid or not
 *
 * @param  {string} uuid the uuid
 * @returns {boolean|string} string with error message or true
 */
function isUuidValid (uuid) {
  // eslint-disable-next-line max-len
  const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  if (UUID_REGEX.test(uuid)) { return true }

  return 'The token does not have the correct format.'
}

/**
 *  Check if a value is empty or not
 *
 * @param  {any} value the value
 * @returns {boolean|string} string with error message or true
 */
function isNotEmpty (value) {
  if (value === '' || value === undefined || value === null) {
    return 'The value can not be empty'
  }

  return true
}

/**
 *  Check if a password is valid or not
 *
 * @param  {string} password the password
 * @returns {boolean|string} string with error message or true
 */
function isPasswordValid (password) {
  const passwordEntropy = stringEntropy(password)
  if (passwordEntropy < MIN_ENTROPY) {
    // eslint-disable-next-line max-len
    return `The password provided is not strong enough. The password rate is ${((passwordEntropy * 100) / MIN_ENTROPY).toFixed()} and you need to reach 100, try adding more or different characters.`
  }

  return true
}

/**
 *  Check if two passwords are equal or not
 *
 * @param  {string} password1 the first password
 * @param  {string} password2 the second password
 * @returns {boolean|string} string with error message or true
 */
function isPasswordEqual (password1, password2) {
  if (password1 === password2) { return true }

  return 'Passwords do not match.'
}

/**
 *  Check if the chain name is valid
 *
 * @param  {string} chain the chain name
 * @returns {boolean} true if the value is in the chains list
 */
function isChainValid (chain) {
  return CHAIN_OPTIONS.find(c => c === chain)
}

module.exports = {
  isUserValid,
  isUuidValid,
  isEmailValid,
  isNotEmpty,
  isChainValid,
  isPasswordEqual,
  isPasswordValid,

  MIN_ENTROPY,
  CHAIN_OPTIONS
}
