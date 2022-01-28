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
        cy.get('#radio-step').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.get('#group-5').within(() => {
                cy.get('#radio-1').click()
            })
            cy.contains('Next').click()
        })
    })

    it('checkbox', () => {
        cy.get('#checkbox-step').within(() => {
            cy.get('#checkbox-1').click()
            cy.get('#checkbox-2').click()
            cy.get('#checkbox-3').click()
            cy.get('#checkbox-4').click()
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.get('#checkbox-2-text').type('hello')
            cy.get('#checkbox-4').click()
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

    it('table-select', () => {
        cy.get('#table-select').within(() => {
            cy.contains('Next').click()
        })
    })

    it('section', () => {
        cy.get('#section-step').within(() => {
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.contains('Text 1 is required')
            cy.contains('Text 3 is required')
            cy.contains('Text input is required')
            cy.get('#text-1').type('text-1')
            cy.get('#text-3').type('text-3')
            cy.get('#hide-section').click()
            cy.contains('Next').click()
        })
    })

    it('hidden', () => {
        cy.get('#hidden-step').within(() => {
            cy.get('#show-hidden').click()
            cy.contains('Next').click()
            cy.contains('Please fix validation errors')
            cy.get('#show-hidden').click()
            cy.contains('Next').click()
        })
    })

    it('review', () => {
        cy.get('#review-step').within(() => {
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
            cy.get('#radio').within(() => {
                cy.get('#group-5').within(() => {
                    cy.get('#radio-1').contains('Radio 1')
                })
            })
            cy.get('#checkbox').within(() => {
                cy.get('#checkbox-1')
                cy.get('#checkbox-2')
                cy.get('#checkbox-2-text').contains('hello')
                cy.get('#checkbox-3')
            })
            cy.contains('Submit')
        })
    })
})
