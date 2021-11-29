/// <reference types="cypress" />
describe('ansible wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?wizard=ansible')
        cy.get('h1').contains('Create Ansible template')
    })

    it('details', () => {
        cy.get('#name').type('test-name')
        cy.get('#credential').click().get('#default').click()
        cy.contains('Next').click()
    })

    it('install', () => {
        cy.contains('Add job template').click()
        cy.get('#name').type('test-name')
        cy.contains('Add variable').click()
        cy.get('#variable').type('test-variable')
        cy.get('#value').type('test-value')
        cy.contains('Next').click()
    })

    it('upgrade', () => {
        cy.contains('Add job template').click()
        cy.get('#name').type('test-name')
        cy.contains('Add variable').click()
        cy.get('#variable').type('test-variable')
        cy.get('#value').type('test-value')
        cy.contains('Next').click()
    })

    it('summary', async () => {
        cy.contains('Submit').click()
    })
})
