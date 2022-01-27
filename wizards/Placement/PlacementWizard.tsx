import { Split, SplitItem } from '@patternfly/react-core'
import { Fragment } from 'react'
import {
    ArrayInput,
    Multiselect,
    Section,
    Select,
    Step,
    StringsInput,
    TextDetail,
    TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'

interface IResource {
    metadata: { name: string; namespace: string }
}

export function PlacementWizard(props: { namespaces: string[]; clusterSets: IResource[]; onSubmit: WizardSubmit; onCancel: WizardCancel }) {
    return (
        <WizardPage title="Create placement" defaultData={[]} onSubmit={props.onSubmit} onCancel={props.onCancel}>
            <Step label="Placement" id="placement-step">
                <PlacementStep namespaces={props.namespaces} clusterSets={props.clusterSets} />
            </Step>
        </WizardPage>
    )
}

function MatchExpressions() {
    return (
        <ArrayInput
            label="Label selectors"
            path="matchExpressions"
            placeholder="Add label selector"
            collapsedContent={
                <Split hasGutter>
                    <SplitItem>
                        <TextDetail path="key" />
                    </SplitItem>
                    <SplitItem>
                        <TextDetail path="operator" />
                    </SplitItem>
                    <SplitItem>
                        <TextDetail path="values" />
                    </SplitItem>
                </Split>
            }
            newValue={{ key: '', operator: 'In', value: [] }}
        >
            <TextInput label="Label" path="key" />
            <Select
                label="Operator"
                path="operator"
                options={[
                    { label: 'equals one of', value: 'In' },
                    { label: 'does not equals any of', value: 'NotIn' },
                    'Exists',
                    'DoesNotExist',
                ]}
            />
            <StringsInput label="Values" path="values" hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)} />
        </ArrayInput>
    )
}

export function PlacementStep(props: { namespaces: string[]; clusterSets: IResource[] }) {
    return (
        <Fragment>
            <Section label="Placements" collapsable>
                <ArrayInput
                    id="placements"
                    label="Placements"
                    description="Placement defines a rule to select a set of ManagedClusters from the
                    ManagedClusterSets bound to the placement namespace."
                    path={null}
                    filter={(resource) => resource.kind === 'Placement'}
                    placeholder="Add placement"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter placement"
                    newValue={{
                        apiVersion: 'placements.cluster.open-cluster-management.io',
                        kind: 'Placement',
                        metadata: { name: '', namespace: '' },
                    }}
                    // hidden={(rules) => !rules.length}
                >
                    <TextInput label="Name" path="metadata.name" required helperText="Name needs to be unique to the namespace." />
                    <Select
                        label="Namespace"
                        path="metadata.namespace"
                        required
                        options={props.namespaces}
                        helperText="The namespace on the hub cluster where the resources will be created."
                    />
                    <Multiselect
                        label="Cluster sets"
                        path="spec.clusterSets"
                        required
                        options={props.clusterSets.map((clusterSet) => clusterSet.metadata.name)}
                        helperText="The ClusterSets from which the
                        Clusters are selected. If none are selected, all
                        Clusters will be selected from the Cluster Sets
                        bound to the namespace."
                    />
                    <ArrayInput
                        label="Cluster selectors"
                        path="spec.predicates"
                        placeholder="Add cluster selector"
                        collapsedContent="TODO"
                        description="Selects the clusters in the cluster sets by label and claim. If more then one cluster selector is configured, then the cluster results are combined."
                    >
                        <ArrayInput
                            label="Cluster label selectors"
                            path="requiredClusterSelector.labelSelector"
                            placeholder="Add label selector"
                            collapsedContent="TODO"
                        >
                            <MatchExpressions />
                        </ArrayInput>
                        <ArrayInput
                            label="Cluster claim selectors"
                            path="requiredClusterSelector.claimSelector"
                            placeholder="Add"
                            collapsedContent="TODO"
                        >
                            <MatchExpressions />
                        </ArrayInput>
                    </ArrayInput>
                </ArrayInput>
            </Section>
            <Section label="Placement Rules" collapsable>
                <ArrayInput
                    id="placement-rules"
                    label="Placement rules"
                    description="Placement rules determine which clusters a policy will be applied."
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementRule'}
                    placeholder="Add placement rule"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter placement rule"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementRule',
                        metadata: {},
                        spec: {
                            clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' },
                            clusterSelector: {
                                matchExpressions: [{ key: '', operator: 'In', values: [''] }],
                            },
                        },
                    }}
                    // hidden={(rules) => !rules.length}
                >
                    <TextInput
                        id="name"
                        path="metadata.name"
                        label="Name"
                        required
                        helperText="The name of the placement rule should match the rule name in a placement binding so that it is bound to a policy."
                    />
                    <ArrayInput
                        id="matchExpressions"
                        label="Match expressions"
                        path="spec.clusterSelector.matchExpressions"
                        placeholder="Add expression"
                        collapsedPlaceholder="Expand to enter expression"
                        collapsedContent={'key'}
                        newValue={{
                            key: '',
                            operator: 'In',
                            values: [''],
                        }}
                    >
                        <TextInput id="key" path="key" label="Label" />
                        <StringsInput id="values" path="values" label="Equals one of" />
                    </ArrayInput>
                </ArrayInput>
            </Section>
            <Section label="Placement Bindings" collapsable>
                <ArrayInput
                    id="placement-bindings"
                    label="Placement bindings"
                    description="Policies are applied to clusters using placement bindings. Placement bindings bind policies to a placement rule."
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementBinding'}
                    placeholder="Add binding"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter binding"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementBinding',
                        metadata: {},
                        placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                        subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                    }}
                    // hidden={(bindings) => !bindings.length}
                    dropdownItems={[
                        {
                            label: 'Add placement binding',
                            action: () => ({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: {},
                                placementRef: { apiGroup: 'placements.cluster.open-cluster-management.io', kind: 'Placement' },
                                subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                            }),
                        },
                        {
                            label: 'Add placement rule binding',
                            action: () => ({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: {},
                                placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                                subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                            }),
                        },
                    ]}
                >
                    <TextInput path="metadata.name" label="Binding name" required />
                    <Select
                        path="placementRef.name"
                        label="Placement"
                        helperText="The placement used to select clusters."
                        required
                        hidden={(binding) => binding.placementRef?.kind !== 'Placement'}
                        options={[]}
                    />
                    <Select
                        path="placementRef.name"
                        label="Placement rule"
                        helperText="The placement rule used to select clusters for placement."
                        required
                        hidden={(binding) => binding.placementRef?.kind !== 'PlacementRule'}
                        options={[]}
                    />
                    <ArrayInput
                        path="subjects"
                        label="Subjects"
                        description="Placement bindings can have multiple subjects which the placement is applied to."
                        placeholder="Add placement subject"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter subject"
                        newValue={{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }}
                    >
                        <TextInput path="name" label="Subject name" required />
                    </ArrayInput>
                </ArrayInput>
            </Section>
        </Fragment>
    )
}
