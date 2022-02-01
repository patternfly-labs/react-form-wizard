/// <reference types="cypress" />

describe('policy set wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=policy-set')
        cy.get('h1').contains('Create policy set')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
    })

    it('details', () => {
        cy.get('#name').type('my-policy-set')
        cy.get('#namespace').click().get('#default').click()
        cy.contains('Next').click()
    })

    it('policies', () => {
        cy.get('#policies').within(() => {})
        cy.contains('Next').click()
    })

    it('placement', () => {
        cy.contains('Next').click()
    })

    it('summary', () => {
        cy.get('#review-step').within(() => {
            cy.get('#name').contains('my-policy-set')
            cy.get('#namespace').contains('default')
        })
    })
})
