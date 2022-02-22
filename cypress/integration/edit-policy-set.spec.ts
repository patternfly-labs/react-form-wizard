/// <reference types="cypress" />
import YAML from 'yaml'
import { RouteE } from '../../wizards/Routes'

describe('edit policy set', () => {
    it('displays', () => {
        cy.visit(`http://localhost:3000/${RouteE.EditPolicySet1}`)
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
    })

    it('details', () => {
        cy.get('#name').should('be.disabled')
        // cy.get('#namespace').should('be.disabled')
        cy.contains('Next').click()
    })

    it('policies', () => {
        cy.get('#policies').within(() => {
            cy.get('[type="checkbox"]').check()
        })
        cy.contains('Next').click()
    })

    it('placement', () => {
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
                    description: 'Policy set with a single Placement and PlacementBinding.',
                    policies: ['my-policy-1', 'my-policy-2'],
                },
            },
            {
                apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                kind: 'Placement',
                metadata: {
                    name: 'my-policy-set-placement-1',
                    namespace: 'my-namespace-1',
                },
                spec: {
                    numberOfClusters: 1,
                    clusterSets: ['my-cluster-set-1'],
                    predicates: [
                        {
                            requiredClusterSelector: {
                                labelSelector: {
                                    matchLabels: {
                                        'local-cluster': 'true',
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            {
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'PlacementBinding',
                metadata: {
                    name: 'my-policy-set-placement-1-binding',
                    namespace: 'my-namespace-1',
                },
                placementRef: {
                    name: 'my-policy-set-placement-1',
                    kind: 'Placement',
                    apiGroup: 'cluster.open-cluster-management.io',
                },
                subjects: [
                    {
                        name: 'my-policy-set',
                        kind: 'PolicySet',
                        apiGroup: 'policy.open-cluster-management.io',
                    },
                ],
            },
        ]

        cy.get('#yaml-editor').should('have.text', expected.map((doc) => YAML.stringify(doc)).join('---\n'))
        cy.contains('Submit').should('be.enabled')
    })
})
