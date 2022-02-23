/// <reference types="cypress" />
import YAML from 'yaml'
import { RouteE } from '../../wizards/Routes'

describe('create policy set', () => {
    it('displays', () => {
        cy.visit(`http://localhost:3000/${RouteE.CreatePolicySet}`)
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
    })

    it('details', () => {
        cy.get('#name').type('my-policy-set')
        cy.get('#namespace').click().get('#my-namespace-1').click()
        cy.contains('Next').click()
    })

    it('policies', () => {
        cy.get('#policies').within(() => {
            cy.get('[type="checkbox"]').check()
        })
        cy.contains('Next').click()
    })

    it('placement', () => {
        cy.get('#add-button').click()
        cy.get('#label-expressions').within(() => {
            cy.get('#key').type('local-cluster')
            cy.get('#values').type('true')
        })
        cy.contains('Next').click()
    })

    it('review', () => {
        const expected = [
            {
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'PolicySet',
                metadata: {
                    name: 'my-policy-set',
                    namespace: 'my-namespace-1',
                },
                spec: {
                    description: '',
                    policies: ['my-policy-1', 'my-policy-2'],
                },
            },
            {
                apiVersion: 'apps.open-cluster-management.io/v1beta1',
                kind: 'PlacementRule',
                metadata: {
                    name: 'my-policy-set-placement',
                    namespace: 'my-namespace-1',
                },
                spec: {
                    clusterSelector: {
                        matchExpressions: [
                            {
                                key: 'local-cluster',
                                operator: 'In',
                                values: ['true'],
                            },
                        ],
                    },
                },
            },
            {
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'PlacementBinding',
                metadata: {
                    name: 'my-policy-set-placement',
                    namespace: 'my-namespace-1',
                },
                placementRef: {
                    name: 'my-policy-set-placement',
                    kind: 'PlacementRule',
                    apiGroup: 'apps.open-cluster-management.io',
                },
                subjects: [
                    {
                        apiGroup: 'policy.open-cluster-management.io',
                        kind: 'PolicySet',
                        name: 'my-policy-set',
                    },
                ],
            },
        ]

        cy.get('#yaml-editor').should('have.text', expected.map((doc) => YAML.stringify(doc)).join('---\n'))
        cy.contains('Submit').should('be.enabled')
    })
})
