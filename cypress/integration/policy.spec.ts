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
        cy.get('#templates').within(() => {
            cy.contains('Add policy template').click()
            //TODO
        })

        cy.contains('Next').click()
    })

    it('placement', () => {
        cy.get('#placement-rules').within(() => {
            //TODO
        })

        cy.get('#placement-bindings').within(() => {
            //TODO
        })

        cy.contains('Next').click()
    })

    it('security groups', () => {
        cy.get('#categories').within(() => {
            cy.get('#add-button').click()
            cy.get('#categories-1').type('category-1')

            cy.get('#add-button').click()
            cy.get('#categories-2').type('category-2')
        })

        cy.get('#standards').within(() => {
            cy.get('#add-button').click()
            cy.get('#standards-1').type('standard-1')

            cy.get('#add-button').click()
            cy.get('#standards-2').type('standard-2')
        })

        cy.get('#controls').within(() => {
            cy.get('#add-button').click()
            cy.get('#controls-1').type('control-1')

            cy.get('#add-button').click()
            cy.get('#controls-2').type('control-2')
        })

        cy.contains('Next').click()
    })

    it('summary', () => {
        cy.get('#name').contains('my-policy')
        cy.get('#namespace').contains('default')

        cy.get('#categories').contains('category-1')
        cy.get('#categories').contains('category-2')

        cy.get('#standards').contains('standard-1')
        cy.get('#standards').contains('standard-2')

        cy.get('#controls').contains('control-1')
        cy.get('#controls').contains('control-2')
    })
})
