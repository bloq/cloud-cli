/* globals Stripe */
'use strict'

const stripe = Stripe('pk_test_pkNNPUJCK2Gt4mP5lPpAKShA')

function registerElements (elements, exampleName) {
  const formClass = `.${exampleName}`
  const example = document.querySelector(formClass)

  const form = example.querySelector('form')
  const resetButton = example.querySelector('a.reset')
  const error = form.querySelector('.error')
  const errorMessage = error.querySelector('.message')

  function enableInputs () {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"]'
      ),
      function (input) {
        input.removeAttribute('disabled')
      }
    )
  }

  function disableInputs () {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"]'
      ),
      function (input) {
        input.setAttribute('disabled', 'true')
      }
    )
  }

  function triggerBrowserValidation () {
    const submit = document.createElement('input')
    submit.type = 'submit'
    submit.style.display = 'none'
    form.appendChild(submit)
    submit.click()
    submit.remove()
  }

  const savedErrors = {}
  elements.forEach(function (element, idx) {
    element.on('change', function (event) {
      if (event.error) {
        error.classList.add('visible')
        savedErrors[idx] = event.error.message
        errorMessage.innerText = event.error.message
      } else {
        savedErrors[idx] = null

        // Loop over the saved errors and find the first one, if any.
        const nextError = Object.keys(savedErrors)
          .sort()
          .reduce(function (maybeFoundError, key) {
            return maybeFoundError || savedErrors[key]
          }, null)

        if (nextError) {
          // Now that they've fixed the current error, show another one.
          errorMessage.innerText = nextError
        } else {
          // The user fixed the last error no more errors.
          error.classList.remove('visible')
        }
      }
    })
  })

  // Listen on the form's 'submit' handler...
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    // Trigger HTML5 validation UI on the form if any of the inputs fail
    // validation.
    let plainInputsValid = true
    Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
      if (input.checkValidity && !input.checkValidity()) {
        plainInputsValid = false
      }
    })

    if (!plainInputsValid) {
      triggerBrowserValidation()
      return
    }

    // Show a loading screen...
    example.classList.add('submitting')

    // Disable all inputs.
    disableInputs()

    // Gather additional customer data we may have collected in our form.
    const email = form.querySelector(`#${exampleName}-email`)
    const name = form.querySelector(`#${exampleName}-name`)
    const phone = form.querySelector(`#${exampleName}-phone`)
    const address1 = form.querySelector(`#${exampleName}-address`)
    const city = form.querySelector(`#${exampleName}-city`)
    const state = form.querySelector(`#${exampleName}-state`)
    const zip = form.querySelector(`#${exampleName}-zip`)
    const country = form.querySelector(`#${exampleName}-country`)

    const additionalData = {
      owner: {
        email: email ? email.value : undefined,
        name: name ? name.value : undefined,
        phone: phone ? phone.value : undefined,
        address: {
          line1: address1 ? address1.value : undefined,
          city: city ? city.value : undefined,
          state: state ? state.value : undefined,
          postal_code: zip ? zip.value : undefined,
          country: country ? country.value : undefined
        }
      }
    }

    stripe.createSource(elements[0], additionalData)
      .then(function (result) {
        example.classList.remove('submitting')

        if (result.source) {
          const form = document.getElementById('payment-form')
          const hiddenInput = document.createElement('input')
          hiddenInput.setAttribute('type', 'hidden')
          hiddenInput.setAttribute('name', 'source')
          hiddenInput.setAttribute('value', result.source.id)

          form.appendChild(hiddenInput)
          form.submit()
          example.classList.add('submitted')
        } else {
          enableInputs()
        }
      })
      .catch(err => console.log(err))
  })

  resetButton.addEventListener('click', function (e) {
    e.preventDefault()
    form.reset()
    elements.forEach(function (element) { element.clear() })
    error.classList.remove('visible')
    enableInputs()
    example.classList.remove('submitted')
  })
}
