/// <reference types="cypress" />
import YAML from 'yaml'

describe('ansible wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=ansible')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Create Ansible automation template')
    })

    it('details', () => {
        cy.get('#name').type('my-ansible-autmation-template')
        cy.get('#namespace').click().get('#default').click()
        cy.contains('Next').click()
    })

    it('install', () => {
        cy.get('#install-secret').click().get('#my-install-ansible-creds').click()

        cy.get('#install-prehooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#install-prehooks-0').within(() => {
                cy.get('#name').type('pre-install-name')
                cy.contains('Add variable').click()
                cy.get('#extra_vars').within(() => {
                    cy.get('#key').type('pre-install-variable')
                    cy.get('#value').type('pre-install-value')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.get('#install-posthooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#install-posthooks-0').within(() => {
                cy.get('#name').type('post-install-name')
                cy.contains('Add variable').click()
                cy.get('#extra_vars').within(() => {
                    cy.get('#key').type('post-install-variable')
                    cy.get('#value').type('post-install-value')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.contains('Next').click()
    })

    it('upgrade', () => {
        cy.get('#upgrade-secret').click().get('#my-upgrade-ansible-creds').click()

        cy.get('#upgrade-prehooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#upgrade-prehooks-0').within(() => {
                cy.get('#name').type('pre-upgrade-name')
                cy.contains('Add variable').click()
                cy.get('#extra_vars').within(() => {
                    cy.get('#key').type('pre-upgrade-variable')
                    cy.get('#value').type('pre-upgrade-value')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.get('#upgrade-posthooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#upgrade-posthooks-0').within(() => {
                cy.get('#name').type('post-upgrade-name')
                cy.contains('Add variable').click()
                cy.get('#extra_vars').within(() => {
                    cy.get('#key').type('post-upgrade-variable')
                    cy.get('#value').type('post-upgrade-value')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.contains('Next').click()
    })

    it('summary', () => {
        cy.get('#name').contains('my-ansible-autmation-template')
        cy.get('#namespace').contains('default')

        cy.get('#install').within(() => {
            cy.get('#install-secret').contains('my-install-ansible-creds')
            cy.get('#install-prehooks').contains('pre-install-name')
            cy.get('#install-prehooks').contains('pre-install-name')
            cy.get('#install-posthooks').contains('post-install-name')
        })

        cy.get('#upgrade').within(() => {
            cy.get('#upgrade-secret').contains('my-upgrade-ansible-creds')
            cy.get('#upgrade-prehooks').contains('pre-upgrade-name')
            cy.get('#upgrade-prehooks').contains('pre-upgrade-name')
            cy.get('#upgrade-posthooks').contains('post-upgrade-name')
        })

        cy.contains('Submit')
    })

    it('results', () => {
        const expected = {
            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
            kind: 'ClusterCurator',
            metadata: { name: 'my-ansible-autmation-template', namespace: 'default' },
            spec: {
                install: {
                    towerAuthSecret: 'my-install-ansible-creds',
                    prehook: [{ name: 'pre-install-name', extra_vars: { 'pre-install-variable': 'pre-install-value' } }],
                    posthook: [{ name: 'post-install-name', extra_vars: { 'post-install-variable': 'post-install-value' } }],
                },
                upgrade: {
                    towerAuthSecret: 'my-upgrade-ansible-creds',
                    prehook: [{ name: 'pre-upgrade-name', extra_vars: { 'pre-upgrade-variable': 'pre-upgrade-value' } }],
                    posthook: [{ name: 'post-upgrade-name', extra_vars: { 'post-upgrade-variable': 'post-upgrade-value' } }],
                },
            },
        }

        const yaml = YAML.stringify(expected)
        cy.get('#yaml-editor').should('have.text', yaml)
    })
})
