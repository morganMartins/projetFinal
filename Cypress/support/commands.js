Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
  })

Cypress.Commands.add('connexion', (usr, psw) =>  {
  cy.visit('https://trello.com/home');
  cy.get('#BXP-APP > header.BigNavstyles__Header-sc-1mttgq7-1.hNNfeR > div > div.BigNavstyles__NavBar-sc-1mttgq7-3.caTbTe > div.Buttonsstyles__ButtonGroup-sc-1jwidxo-3.jnMZCI > a:nth-child(1)').click()
  cy.wait(1000)
  cy.url().should('eql', 'https://trello.com/login')
  cy.get('#user').type(usr)
  cy.get('#login').click()
  cy.wait(1000)
  cy.origin('https://id.atlassian.com', () => {

  cy.get('#password').type(psw)
  cy.get('#login-submit').click()
  })  
})

