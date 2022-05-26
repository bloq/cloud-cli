'use strict'
const stringEntropy = require('fast-password-entropy')
const postalCodesValidator = require('postal-codes-js')
const consola = require('consola')
const config = require('./config')
const MIN_ENTROPY = config.get('passwordEntropy')

/**
 *  Check if an email is valid or not
 *
 * @param  {string} email the email address
 * @returns {boolean|string} string with error message or true
 */
function isEmailValid(email) {
  // eslint-disable-next-line max-len
  const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line
  if (EMAIL_REGEX.test(String(email).toLowerCase())) {
    return true
  }

  return 'The email is not valid.'
}

/**
 *  Check if the user is valid or not
 *
 * @param  {string} user the user email or id
 * @returns {boolean|string} string with error message or true
 */
function isUserValid(user) {
  // eslint-disable-next-line max-len
  const USER_REGEX =
    /user-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
  if (USER_REGEX.test(user)) {
    return true
  }

  const emailValidation = isEmailValid(user)
  if (typeof emailValidation === 'boolean') {
    return true
  }

  return 'The email or account id does not have the correct format.'
}

/**
 *  Check if a uuid is valid or not
 *
 * @param  {string} uuid the uuid
 * @returns {boolean|string} string with error message or true
 */
function isUuidValid(uuid) {
  // eslint-disable-next-line max-len
  const UUID_REGEX =
    /[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
  if (UUID_REGEX.test(uuid)) {
    return true
  }

  return 'The token does not have the correct format.'
}

function isFormatValid(name, value) {
  const pattern =
    '-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
  const reg = new RegExp(
    `^(?=.{0,${name.length + pattern.length}}$)${name}${pattern}$`
  )

  if (!reg.test(value)) {
    // eslint-disable-next-line no-console
    consola.error(
      ` "${value}" is not a valid ${name}. Please check the format.\n`
    )
    return false
  }
  return true
}

/**
 *  Check if a value is empty or not
 *
 * @param  {any} value the value
 * @returns {boolean|string} string with error message or true
 */
function isNotEmpty(value) {
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
function isPasswordValid(password) {
  const passwordEntropy = stringEntropy(password)
  if (passwordEntropy < MIN_ENTROPY) {
    // eslint-disable-next-line max-len
    return `The password provided is not strong enough. The password rate is ${(
      (passwordEntropy * 100) /
      MIN_ENTROPY
    ).toFixed()} and you need to reach 100, try adding more or different characters.`
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
function arePasswordEquals(password1, password2) {
  if (password1 === password2) {
    return true
  }

  return 'Passwords do not match.'
}

/**
 *  Check if the zip code is valid
 *
 * @param  {string} countryCode the country code
 * @param  {string} zipCode the zip code
 * @returns {boolean|string} string with error message or true
 */
const isZipCodeValid = (countryCode, zipCode) =>
  postalCodesValidator.validate(countryCode, zipCode) === true
    ? true
    : 'The zip code is invalid'

module.exports = {
  isUserValid,
  isUuidValid,
  isFormatValid,
  isEmailValid,
  isNotEmpty,
  arePasswordEquals,
  isPasswordValid,
  isZipCodeValid,
  MIN_ENTROPY
}
