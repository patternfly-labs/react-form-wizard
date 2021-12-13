/// <reference types="cypress" />
import YAML from 'yaml'

describe('credentials wizard - aws', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=credentials')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Add credentials')
    })

    it('credentials type', () => {
        cy.get('#aws').click()
        cy.contains('Next').click()
    })

    it('details', () => {
        cy.get('#name').type('my-credentials')
        cy.get('#namespace').click().get('#default').click()
        cy.contains('Next').click()
    })

    it('aws', () => {
        cy.get('#aws-key-id').type('my-key-id')
        cy.get('#aws-access-key').type('my-access-key')
        cy.contains('Next').click()
    })

    it('pull secret and ssh', () => {
        cy.get('#pull-secret').type('my-pull-secret')
        cy.get('#ssh-public-key').type('my-ssh-public')
        cy.get('#ssh-private-key').type('my-ssh-private')
        cy.contains('Next').click()
    })

    it('summary', () => {
        cy.get('#name').contains('my-credentials')
        cy.get('#namespace').contains('default')
    })

    it('results', () => {
        const expected = {
            apiVersion: 'v1',
            kind: 'Secret',
            type: 'Opaque',
            metadata: {
                name: 'my-credentials',
                namespace: 'default',
                labels: {
                    'cluster.open-cluster-management.io/credentials': '',
                    'cluster.open-cluster-management.io/type': 'aws',
                },
            },
            stringData: {
                aws_access_key_id: 'my-key-id',
                aws_secret_access_key: 'my-access-key',
                pullSecret: 'my-pull-secret',
                'ssh-publickey': 'my-ssh-public',
                'ssh-privatekey': 'my-ssh-private',
            },
        }

        const yaml = YAML.stringify(expected)
        cy.get('#yaml-editor').should('have.text', yaml)
    })
})
