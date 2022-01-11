import {
    FormWizardCheckbox,
    FormWizardLabels,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
    FormWizardTimeRange,
} from '../../src'

import { Fragment, useMemo } from 'react'

export function ArgoWizard() {
    const requeueTimes = useMemo(() => [30, 60, 120, 180, 300], [])
    return (
        <FormWizardPage
            title="Create Argo CD applicationSet"
            defaultData={{
                apiVersion: 'argoproj.io/v1alpha1',
                kind: 'ApplicationSet',
                metadata: {
                    name: '',
                    namespace: '',
                },
                spec: {
                    generators: [
                        {
                            clusterDecisionResource: {
                                configMapRef: 'acm-placement',
                                labelSelector: {
                                    matchLabels: {
                                        'cluster.open-cluster-management.io/placement': '',
                                    },
                                },
                                requeueAfterSeconds: '',
                            },
                        },
                    ],
                    template: {
                        spec: {
                            destination: {
                                server: '{{server}}',
                            },
                        },
                    },
                },
            }}
        >
            <FormWizardStep label="General">
                <FormWizardTextInput
                    id=""
                    path="metadata.name"
                    label="ApplicationSet name"
                    placeholder="Enter the application set name"
                    required
                />
                <FormWizardSelect
                    id=""
                    path="metadata.namespace"
                    label="Argo server"
                    placeholder="Select the Argo server"
                    labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                    options={['default', 'server1', 'server2']}
                    required
                />
                <FormWizardSelect
                    id=""
                    // TODO
                    path=""
                    label="Requeue time"
                    options={requeueTimes}
                    labelHelp="Cluster decision resource requeue time in seconds"
                    required
                />
            </FormWizardStep>
            <FormWizardStep label="Template">
                <FormWizardTiles id="" label="Repository type">
                    <FormWizardTile
                        id="git"
                        path={null}
                        value="SubscriptionGit"
                        label="Git"
                        description="Use a Git repository"
                        // add content
                        // newValue={{ spec: 'test' }}
                    />
                    <FormWizardTile id="helm" value="SubscriptionHelm" label="Helm" description="Use a Helm repository" />
                </FormWizardTiles>
                <FormWizardSection label="Destination">
                    <FormWizardTextInput
                        id=""
                        path="spec.template.spec.destination.namespace"
                        label="Remote namespace"
                        placeholder="Enter the destination namespace"
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>
            <FormWizardStep label="Sync policy">
                <FormWizardSection
                    label="Sync policy"
                    description="Settings used to configure application syncing when there are differences between the desired state and the live cluster state."
                >
                    {/* Git only sync policies */}
                    {/* <FormWizardHidden hidden={(data) => data.repositoryType !== 'Git'}> */}
                    {/* TODO - Hide if not Git */}
                    <FormWizardCheckbox id="syncPolicy.prune" label="Delete resources that are no longer defined in Git" />
                    <FormWizardCheckbox
                        id="syncPolicy.pruneLast"
                        label="Delete resources that are no longer defined in Git at the end of a sync operation"
                    />
                    <FormWizardCheckbox id="syncPolicy.replace" label="Replace resources instead of applying changes from Git" />
                    {/* </FormWizardHidden> */}
                    <FormWizardCheckbox id="syncPolicy.allowEmpty" label="Allow applications to have empty resources" />
                    <FormWizardCheckbox id="syncPolicy.applyOutOfSyncOnly" label="Only synchronize out-of-sync resources" />
                    <FormWizardCheckbox id="syncPolicy.selfHeal" label="Automatically sync when cluster state changes" />
                    <FormWizardCheckbox id="syncPolicy.createNamespace" label="Automatically create namespace if it does not exist" />
                    <FormWizardCheckbox id="syncPolicy.validate" label="Disable kubectl validation" />
                    <FormWizardCheckbox id="syncPolicy.prunePropagationPolicy" label="Prune propagation policy">
                        <FormWizardSelect
                            id="syncPolicy.propagationPolicy"
                            label="Propogation policy"
                            options={['foreground', 'background', 'orphan']}
                            required
                        />
                    </FormWizardCheckbox>
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}
