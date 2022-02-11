/// <reference types="cypress" />
import { RouteE } from '../../wizards/Routes'

function displays(route: RouteE) {
    cy.visit(`http://localhost:3000/${route}`)
    cy.get('#nav-toggle').click()
    cy.get('#yaml-switch').click({ force: true })
}

const details = () => {
    cy.get('#name').type('my-policy-set')
    cy.get('#namespace').click().get('#my-namespace-1').click()
    cy.contains('Next').click()
}

const detailsEditing = () => {
    cy.get('#name').should('be.disabled')
    // cy.get('#namespace').should('be.disabled')
    cy.contains('Next').click()
}

const policies = () => {
    cy.get('#policies').within(() => {})
    cy.contains('Next').click()
}

const reviewDetails = () => {
    cy.get('#review-step').within(() => {
        cy.get('#name').contains('my-policy-set')
        cy.get('#namespace').contains('my-namespace-1')
    })
}

const reviewPolicies = () => {
    cy.get('#review-step').within(() => {})
}

describe('create policy set', () => {
    it('displays', () => displays(RouteE.CreatePolicySet))
    it('details', details)
    it('policies', policies)
    it('placement', () => {
        cy.contains('Next').click()
    })
    it('review', () => {
        reviewDetails()
        reviewPolicies()
    })
})

describe('edit policy set 1', () => {
    it('displays', () => displays(RouteE.EditPolicySet1))
    it('details', detailsEditing)
    it('policies', policies)
    it('placement', () => {
        cy.contains('Next').click()
    })
    it('review', () => {
        reviewDetails()
        reviewPolicies()
    })
})
