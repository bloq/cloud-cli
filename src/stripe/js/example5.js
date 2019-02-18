/* globals stripe registerElements */
'use strict'

const elements = stripe.elements({ locale: window.__exampleLocale })
const card = elements.create('card', {
  iconStyle: 'solid',
  style: {
    base: {
      'iconColor': '#fff',
      'color': '#fff',
      'fontWeight': 400,
      'fontFamily': 'Helvetica Neue, Helvetica, Arial, sans-serif',
      'fontSize': '16px',
      'fontSmoothing': 'antialiased',
      '::placeholder': { color: '#BFAEF6' },
      ':-webkit-autofill': { color: '#fce883' }
    },
    invalid: {
      iconColor: '#FFC7EE',
      color: '#FFC7EE'
    }
  }
})
card.mount('#example5-card')

registerElements([card], 'example5')
