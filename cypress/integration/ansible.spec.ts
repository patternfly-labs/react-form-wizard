/// <reference types="cypress" />
import YAML from 'yaml'

describe('ansible wizard', () => {
    it('displays', () => {
        cy.visit('http://localhost:3000/?route=ansible')
        cy.get('#nav-toggle').click()
        cy.get('#yaml-switch').click({ force: true })
        cy.get('h1').contains('Create Ansible automation')
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
            cy.get('#install-prehooks-1').within(() => {
                cy.get('#name').type('pre-install-1-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('pre-install-1-variable-1')
                    cy.get('#value-1').type('pre-install-1-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('pre-install-1-variable-2')
                    cy.get('#value-2').type('pre-install-1-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
            cy.contains('Add job template').click()
            cy.get('#install-prehooks-2').within(() => {
                cy.get('#name').type('pre-install-2-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('pre-install-2-variable-1')
                    cy.get('#value-1').type('pre-install-2-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('pre-install-2-variable-2')
                    cy.get('#value-2').type('pre-install-2-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.get('#install-posthooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#install-posthooks-1').within(() => {
                cy.get('#name').type('post-install-1-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('post-install-1-variable-1')
                    cy.get('#value-1').type('post-install-1-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('post-install-1-variable-2')
                    cy.get('#value-2').type('post-install-1-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
            cy.contains('Add job template').click()
            cy.get('#install-posthooks-2').within(() => {
                cy.get('#name').type('post-install-2-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('post-install-2-variable-1')
                    cy.get('#value-1').type('post-install-2-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('post-install-2-variable-2')
                    cy.get('#value-2').type('post-install-2-value-2')
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
            cy.get('#upgrade-prehooks-1').within(() => {
                cy.get('#name').type('pre-upgrade-1-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('pre-upgrade-1-variable-1')
                    cy.get('#value-1').type('pre-upgrade-1-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('pre-upgrade-1-variable-2')
                    cy.get('#value-2').type('pre-upgrade-1-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
            cy.contains('Add job template').click()
            cy.get('#upgrade-prehooks-2').within(() => {
                cy.get('#name').type('pre-upgrade-2-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('pre-upgrade-2-variable-1')
                    cy.get('#value-1').type('pre-upgrade-2-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('pre-upgrade-2-variable-2')
                    cy.get('#value-2').type('pre-upgrade-2-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.get('#upgrade-posthooks').within(() => {
            cy.contains('Add job template').click()
            cy.get('#upgrade-posthooks-1').within(() => {
                cy.get('#name').type('post-upgrade-1-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('post-upgrade-1-variable-1')
                    cy.get('#value-1').type('post-upgrade-1-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('post-upgrade-1-variable-2')
                    cy.get('#value-2').type('post-upgrade-1-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
            cy.contains('Add job template').click()
            cy.get('#upgrade-posthooks-2').within(() => {
                cy.get('#name').type('post-upgrade-2-name')
                cy.get('#extra_vars').within(() => {
                    cy.get('#add-button').click()
                    cy.get('#key-1').type('post-upgrade-2-variable-1')
                    cy.get('#value-1').type('post-upgrade-2-value-1')
                    cy.get('#add-button').click()
                    cy.get('#key-2').type('post-upgrade-2-variable-2')
                    cy.get('#value-2').type('post-upgrade-2-value-2')
                })
                cy.get('.pf-c-form__field-group-toggle').within(() => {
                    cy.get('.pf-c-button').click()
                })
            })
        })

        cy.contains('Next').click()
    })

    it('review', () => {
        cy.get('#review').within(() => {
            cy.get('#details').within(() => {
                cy.get('#name').contains('my-ansible-autmation-template')
                cy.get('#namespace').contains('default')
            })

            cy.get('#install').within(() => {
                cy.get('#install-secret').contains('my-install-ansible-creds')
                cy.get('#install-prehooks').contains('pre-install-1-name')
                cy.get('#install-prehooks').contains('pre-install-2-name')
                cy.get('#install-posthooks').contains('post-install-1-name')
                cy.get('#install-posthooks').contains('post-install-2-name')
            })

            cy.get('#upgrade').within(() => {
                cy.get('#upgrade-secret').contains('my-upgrade-ansible-creds')
                cy.get('#upgrade-prehooks').contains('pre-upgrade-1-name')
                cy.get('#upgrade-prehooks').contains('pre-upgrade-2-name')
                cy.get('#upgrade-posthooks').contains('post-upgrade-1-name')
                cy.get('#upgrade-posthooks').contains('post-upgrade-2-name')
            })

            cy.contains('Submit')
        })
    })

    it('results', () => {
        const expected = {
            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
            kind: 'ClusterCurator',
            metadata: {
                name: 'my-ansible-autmation-template',
                namespace: 'default',
            },
            spec: {
                install: {
                    towerAuthSecret: 'my-install-ansible-creds',
                    prehook: [
                        {
                            name: 'pre-install-1-name',
                            extra_vars: {
                                'pre-install-1-variable-1': 'pre-install-1-value-1',
                                'pre-install-1-variable-2': 'pre-install-1-value-2',
                            },
                        },
                        {
                            name: 'pre-install-2-name',
                            extra_vars: {
                                'pre-install-2-variable-1': 'pre-install-2-value-1',
                                'pre-install-2-variable-2': 'pre-install-2-value-2',
                            },
                        },
                    ],
                    posthook: [
                        {
                            name: 'post-install-1-name',
                            extra_vars: {
                                'post-install-1-variable-1': 'post-install-1-value-1',
                                'post-install-1-variable-2': 'post-install-1-value-2',
                            },
                        },
                        {
                            name: 'post-install-2-name',
                            extra_vars: {
                                'post-install-2-variable-1': 'post-install-2-value-1',
                                'post-install-2-variable-2': 'post-install-2-value-2',
                            },
                        },
                    ],
                },
                upgrade: {
                    towerAuthSecret: 'my-upgrade-ansible-creds',
                    prehook: [
                        {
                            name: 'pre-upgrade-1-name',
                            extra_vars: {
                                'pre-upgrade-1-variable-1': 'pre-upgrade-1-value-1',
                                'pre-upgrade-1-variable-2': 'pre-upgrade-1-value-2',
                            },
                        },
                        {
                            name: 'pre-upgrade-2-name',
                            extra_vars: {
                                'pre-upgrade-2-variable-1': 'pre-upgrade-2-value-1',
                                'pre-upgrade-2-variable-2': 'pre-upgrade-2-value-2',
                            },
                        },
                    ],
                    posthook: [
                        {
                            name: 'post-upgrade-1-name',
                            extra_vars: {
                                'post-upgrade-1-variable-1': 'post-upgrade-1-value-1',
                                'post-upgrade-1-variable-2': 'post-upgrade-1-value-2',
                            },
                        },
                        {
                            name: 'post-upgrade-2-name',
                            extra_vars: {
                                'post-upgrade-2-variable-1': 'post-upgrade-2-value-1',
                                'post-upgrade-2-variable-2': 'post-upgrade-2-value-2',
                            },
                        },
                    ],
                },
            },
        }

        const yaml = YAML.stringify(expected)
        cy.get('#yaml-editor').should('have.text', yaml)
    })
})
