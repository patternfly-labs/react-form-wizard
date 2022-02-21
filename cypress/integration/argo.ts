/// <reference types="cypress" />

describe('argo wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=argo-cd')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Create application set')
    })
})
