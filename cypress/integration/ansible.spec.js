/// <reference types="cypress" />
import YAML from 'yaml'

describe('ansible wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=ansible')
        cy.get('h1').contains('Create Ansible automation template')
    })

    it('details', () => {
        cy.get('#name').type('my-ansible-autmation-template')
        cy.get('#credential').click().get('#my-ansible-creds').click()
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

    it('summary', () => {
        cy.contains('Submit').click()
    })

    it('results', () => {
        const expected = {
            apiVersion: 'app.k8s.io/v1beta1',
            kind: 'Application',
            metadata: { name: 'my-ansible-autmation-template', namespace: null },
            spec: {
                componentKinds: [
                    {
                        group: 'apps.open-cluster-management.io',
                        kind: 'Subscription',
                    },
                ],
                descriptor: {},
                selector: {
                    matchExpressions: [
                        {
                            key: 'app',
                            operator: 'In',
                            values: ['my-ansible-autmation-template'],
                        },
                    ],
                },
            },
        }
        const yaml = YAML.stringify(expected)
        cy.get('pre').should('have.text', yaml)
    })
})
