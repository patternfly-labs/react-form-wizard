/// <reference types="cypress" />

describe('policy wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=policy')
        cy.get('h1').contains('Create policy')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
    })

    it('details', () => {
        cy.get('#name').type('my-policy')
        cy.get('#namespace').click().get('#default').click()
        cy.contains('Next').click()
    })

    it('templates', () => {
        cy.contains('Next').click()
    })

    it('placement', () => {
        cy.contains('Next').click()
    })

    it('security groups', () => {
        cy.contains('Next').click()
    })

    it('summary', () => {
        cy.get('#name').contains('my-policy')
        cy.get('#namespace').contains('default')
    })
})
