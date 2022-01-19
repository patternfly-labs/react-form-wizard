/// <reference types="cypress" />
import YAML from 'yaml'

describe('credentials wizard - aws', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=credentials')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Add credentials')
    })

    it('credential type', () => {
        cy.get('#credential-type').within(() => {
            cy.get('#aws').click()
            cy.contains('Next').click()
        })
    })

    it('basic information', () => {
        cy.get('#basic-information').within(() => {
            cy.get('#name').type('my-credentials')
            cy.get('#namespace').click().get('#default').click()
            cy.get('#base-domain').type('my-base-domain')
            cy.contains('Next').click()
        })
    })

    it('amazon web services', () => {
        cy.get('#amazon-web-services').within(() => {
            cy.get('#aws-key-id').type('my-key-id')
            cy.get('#aws-access-key').type('my-access-key')
            cy.contains('Next').click()
        })
    })

    it('proxy', () => {
        cy.get('#proxy').within(() => {
            cy.get('#http-proxy').type('my-http-proxy')
            cy.get('#https-proxy').type('my-https-proxy')
            cy.get('#no-proxy').type('my-no-proxy')
            cy.get('#trust-bundle').type('my-trust-bundle')
            cy.contains('Next').click()
        })
    })

    it('pull secret and ssh', () => {
        cy.get('#pull-secret-and-ssh').within(() => {
            cy.get('#pull-secret').type('my-pull-secret')
            cy.get('#ssh-private-key').type('my-ssh-private')
            cy.get('#ssh-public-key').type('my-ssh-public')
            cy.contains('Next').click()
        })
    })

    it('review', () => {
        cy.get('#review').within(() => {
            cy.get('#name').contains('my-credentials')
            cy.get('#namespace').contains('default')
        })
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
                baseDomain: 'my-base-domain',
                aws_access_key_id: 'my-key-id',
                aws_secret_access_key: 'my-access-key',
                httpProxy: 'my-http-proxy',
                httpsProxy: 'my-https-proxy',
                noProxy: 'my-no-proxy',
                additionalTrustBundle: 'my-trust-bundle',
                pullSecret: 'my-pull-secret',
                'ssh-privatekey': 'my-ssh-private',
                'ssh-publickey': 'my-ssh-public',
            },
        }

        const yaml = YAML.stringify(expected)
        cy.get('#yaml-editor').should('have.text', yaml)
    })
})
