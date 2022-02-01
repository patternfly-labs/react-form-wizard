import { Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useEffect, useState } from 'react'
import set from 'set-value'
import {
    ArrayInput,
    Hidden,
    ItemSelector,
    KeyValue,
    Multiselect,
    Section,
    Select,
    Step,
    StringsInput,
    TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useItem } from '../../src/contexts/ItemContext'

interface IResource {
    kind: string
    metadata: { name: string; namespace: string }
}

export function PlacementWizard(props: { clusterSets: IResource[]; onSubmit: WizardSubmit; onCancel: WizardCancel }) {
    return (
        <WizardPage title="Create placement" defaultData={[]} onSubmit={props.onSubmit} onCancel={props.onCancel}>
            <Step label="Cluster placement" id="placement-step" autohide={false}>
                <PlacementSection clusterSets={props.clusterSets} />
            </Step>
        </WizardPage>
    )
}

export function PlacementSection(props: { clusterSets: IResource[]; bindingKind?: string; bindingApiGroup?: string }) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    return (
        <Fragment>
            <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
            <Section label="Cluster placement" autohide={false}>
                <Hidden
                    hidden={(resources: IResource[]) => {
                        let hidden = false
                        if (resources?.find((resource) => resource.kind === 'Placement') !== undefined) hidden = true
                        if (resources?.find((resource) => resource.kind === 'PlacementRule') !== undefined) hidden = true
                        if (resources?.find((resource) => resource.kind === 'PlacementBinding') !== undefined) hidden = true
                        return hidden
                    }}
                >
                    <Tile
                        title="Deploy to clusters with specific labels"
                        onClick={() => {
                            resources.push({
                                apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                                kind: 'Placement',
                                metadata: { name: '', namespace: '' },
                            } as IResource)
                            if (props.bindingKind) {
                                resources.push({
                                    apiVersion: 'policy.open-cluster-management.io/v1',
                                    kind: 'PlacementBinding',
                                    metadata: { name: '', namespace: '' },
                                    placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                    subjects: [{ name, kind: props.bindingKind, apiGroup: props.bindingApiGroup }],
                                } as IResource)
                            }
                            update()
                        }}
                    />
                    <Tile
                        title="Deploy to all clusters"
                        onClick={() => {
                            const name = 'all-clusters'
                            resources.push({
                                apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                                kind: 'Placement',
                                metadata: { name, namespace: '' },
                            } as IResource)
                            if (props.bindingKind) {
                                resources.push({
                                    apiVersion: 'policy.open-cluster-management.io/v1',
                                    kind: 'PlacementBinding',
                                    metadata: { name, namespace: '' },
                                    placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                    subjects: [{ name, kind: props.bindingKind, apiGroup: props.bindingApiGroup }],
                                } as IResource)
                            }
                            update()
                        }}
                    />
                    <Tile
                        title="Deploy to local cluster"
                        onClick={() => {
                            const name = 'local-cluster'
                            resources.push({
                                apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                                kind: 'Placement',
                                metadata: { name, namespace: '' },
                                spec: {
                                    predicates: [
                                        {
                                            labelSelector: {
                                                matchLabels: {
                                                    'local-cluster': 'true',
                                                },
                                            },
                                        },
                                    ],
                                },
                            } as IResource)
                            if (props.bindingKind) {
                                resources.push({
                                    apiVersion: 'policy.open-cluster-management.io/v1',
                                    kind: 'PlacementBinding',
                                    metadata: { name, namespace: '' },
                                    placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                    subjects: [{ name, kind: props.bindingKind, apiGroup: props.bindingApiGroup }],
                                } as IResource)
                            }
                            update()
                        }}
                    />
                    <Tile
                        title="Select an existing placement"
                        onClick={() => {
                            update()
                        }}
                    >
                        Uses an existing placement to deploy to clusters.
                    </Tile>
                </Hidden>
                {props.bindingKind ? (
                    <ArrayInput
                        id="placements"
                        label="Placements"
                        description="A placement defines rules to select clusters."
                        labelHelp="Placement defines a rule to select a set of ManagedClusters from the
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
                        hidden={(resources: IResource[]) => resources?.find((resource) => resource.kind === 'Placement') === undefined}
                        defaultCollapsed
                    >
                        <TextInput
                            label="Placement name"
                            path="metadata.name"
                            required
                            labelHelp="Name needs to be unique to the namespace."
                        />
                        <Multiselect
                            label="Cluster sets"
                            path="spec.clusterSets"
                            placeholder="All clusters from cluster sets bound to the namespace"
                            options={props.clusterSets.map((clusterSet) => clusterSet.metadata.name)}
                            labelHelp="The cluster sets from which the
                        clusters are selected. If no cluster sets are selected, all
                        clusters will be selected from the cluster sets
                        bound to the namespace."
                        />
                        <Hidden hidden={(item) => item.spec?.predicates?.length > 1}>
                            <KeyValue
                                label="Cluster labels"
                                path="spec.predicates.0.labelSelector.matchLabels"
                                labelHelp="If no cluster labels are entered, all clusters will be selected from the cluster sets"
                            />
                        </Hidden>
                        <ArrayInput
                            label="Cluster labels"
                            path="spec.predicates"
                            placeholder="Add cluster selector"
                            collapsedContent="TODO"
                            labelHelp="Selects the clusters from the cluster sets by label and claim. If more then one cluster selector is configured, then the cluster results are combined."
                            hidden={(item) => item.spec?.predicates === undefined || item.spec?.predicates?.length <= 1}
                        >
                            <KeyValue label="Labels" path="labelSelector.matchLabels" />
                            {/* <ArrayInput
                            label="Cluster claim selectors"
                            path="requiredClusterSelector.claimSelector"
                            placeholder="Add"
                            collapsedContent="TODO"
                        >
                            <MatchExpressions />
                        </ArrayInput> */}
                        </ArrayInput>
                    </ArrayInput>
                ) : (
                    <ItemSelector selectKey="kind" selectValue="Placement">
                        <TextInput
                            label="Placement name"
                            path="metadata.name"
                            required
                            labelHelp="Name needs to be unique to the namespace."
                        />
                        <Multiselect
                            label="Cluster sets"
                            path="spec.clusterSets"
                            placeholder="All clusters from cluster sets bound to the namespace"
                            options={props.clusterSets.map((clusterSet) => clusterSet.metadata.name)}
                            labelHelp="The cluster sets from which the
                        clusters are selected. If no cluster sets are selected, all
                        clusters will be selected from the cluster sets
                        bound to the namespace."
                        />
                        <KeyValue
                            label="Cluster labels"
                            path="spec.predicates.0.labelSelector.matchLabels"
                            labelHelp="If no cluster labels are entered, all clusters will be selected from the cluster sets"
                            placeholder="Add cluster label"
                        />
                    </ItemSelector>
                )}
                <ArrayInput
                    id="placement-rules"
                    label="Placement rules"
                    labelHelp="Placement rules determine which clusters a policy will be applied."
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
                    hidden={(resources: IResource[]) => resources?.find((resource) => resource.kind === 'PlacementRule') === undefined}
                    defaultCollapsed
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
                <ArrayInput
                    id="placement-bindings"
                    label="Placement bindings"
                    description="Resources are deployed to clusters by binding placements to the resources."
                    labelHelp="Resources are applied to clusters using placement bindings. Placement bindings bind resources to a placement rule."
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementBinding'}
                    placeholder="Add binding"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter binding"
                    dropdownItems={[
                        {
                            label: 'Add placement binding',
                            action: () => ({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: {},
                                placementRef: { apiGroup: 'cluster.open-cluster-management.io', kind: 'Placement' },
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
                    hidden={(resources: IResource[]) => resources?.find((resource) => resource.kind === 'PlacementBinding') === undefined}
                    defaultCollapsed
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

// function MatchExpressions() {
//     return (
//         <ArrayInput
//             label="Label selectors"
//             path="matchExpressions"
//             placeholder="Add label selector"
//             collapsedContent={
//                 <Split hasGutter>
//                     <SplitItem>
//                         <TextDetail path="key" />
//                     </SplitItem>
//                     <SplitItem>
//                         <TextDetail path="operator" />
//                     </SplitItem>
//                     <SplitItem>
//                         <TextDetail path="value" />
//                     </SplitItem>
//                 </Split>
//             }
//             newValue={{ key: '', operator: 'In', value: [] }}
//         >
//             <TextInput label="Label" path="key" />
//             <Select
//                 label="Operator"
//                 path="operator"
//                 options={[{ label: 'is one of', value: 'In' }, { label: 'is not any of', value: 'NotIn' }, 'Exists', 'DoesNotExist']}
//             />
//             <StringsInput label="Values" path="value" hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)} />
//         </ArrayInput>
//     )
// }

export function Sync(props: { kind: string; path: string; targetKind?: string; targetPath?: string }) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    const [value, setValue] = useState('')

    useEffect(() => {
        let changed = false
        for (const resource of resources) {
            if ((props.targetKind === undefined && resource.kind !== props.kind) || resource.kind === props.targetKind) {
                const existingValue = get(resource, props.targetPath ?? props.path)
                if (existingValue !== value) {
                    changed = true
                    set(resource, props.targetPath ?? props.path, value)
                }
            }
        }
        if (changed) update()
    }, [props.kind, props.path, props.targetKind, props.targetPath, resources, update, value])

    if (Array.isArray(resources)) {
        const resource = resources?.find((resource) => resource.kind === props.kind)
        if (resource) {
            const resourceValue = get(resource, props.path)
            if (resourceValue) {
                if (value !== resourceValue) {
                    setValue(resourceValue)
                }
            }
        }
    }
    return <Fragment />
}
