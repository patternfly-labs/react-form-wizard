/// <reference types="cypress" />

describe('inputs wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=inputs')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Inputs')
    })

    it('text input', () => {
        cy.get('#text-input').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.contains('Text input required is required')
            cy.get('#text-input').within(() => {
                cy.get('#textinput-text').type('text-input')
                cy.get('#textinput-required').type('text-input-required')
                cy.get('#textinput-secret').type('text-input-secret')
            })
            cy.contains('Next').click()
        })
    })

    it('text area', () => {
        cy.get('#text-area').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.contains('Text area required is required')
            cy.get('#text-area').within(() => {
                cy.get('#textarea-text').type('text-area')
                cy.get('#textarea-required').type('text-area-required')
                cy.get('#textarea-secret').type('text-area-secret')
            })
            cy.contains('Next').click()
        })
    })

    it('select', () => {
        cy.get('#select').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.contains('Select required is required')
            cy.get('#select').within(() => {
                cy.get('#select-value').click().get(`#Option\\ 1`).click()
                cy.get('#select-required').click().get(`#Option\\ 2`).click()
            })
            cy.contains('Next').click()
        })
    })

    it('tiles', () => {
        cy.get('#tiles').within(() => {
            cy.contains('Next').click()
        })
    })

    it('radio', () => {
        cy.get('#radio').within(() => {
            cy.contains('Next').click()
        })
    })

    it('checkbox', () => {
        cy.get('#checkbox').within(() => {
            cy.contains('Next').click()
        })
    })

    it('labels', () => {
        cy.get('#labels').within(() => {
            cy.contains('Next').click()
        })
    })

    it('key-value', () => {
        cy.get('#key-value').within(() => {
            cy.contains('Next').click()
        })
    })

    it('strings-input', () => {
        cy.get('#strings-input').within(() => {
            cy.contains('Next').click()
        })
    })

    it('array-input', () => {
        cy.get('#array-input').within(() => {
            cy.contains('Next').click()
        })
    })

    it('section', () => {
        cy.get('#section').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.contains('Text 1 is required')
            cy.contains('Text 3 is required')
            cy.get('#text-1').type('text-1')
            cy.get('#text-3').type('text-3')
            cy.contains('Next').click()
        })
    })

    it('review', () => {
        cy.get('#review').within(() => {
            cy.get('#text-input').within(() => {
                cy.get('#textinput-text').contains('text-input')
                cy.get('#textinput-required').contains('text-input-required')
                cy.get('#textinput-secret').contains('text-input-secret')
            })
            cy.get('#text-area').within(() => {
                cy.get('#textarea-text').contains('text-area')
                cy.get('#textarea-required').contains('text-area-required')
                cy.get('#textarea-secret').contains('text-area-secret')
            })
            cy.get('#select').within(() => {
                cy.get('#select-value').contains('Option 1')
                cy.get('#select-required').contains('Option 2')
            })
            cy.contains('Submit')
        })
    })
})
