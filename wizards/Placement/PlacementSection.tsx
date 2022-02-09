import { SelectOption, Split, SplitItem, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useEffect, useMemo, useState } from 'react'
import set from 'set-value'
import { ArrayInput, EditMode, ItemSelector, KeyValue, Section, Select, StringsInput, TextDetail, TextInput } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { Multiselect } from '../../src/inputs/Multiselect'
import { IResource } from '../common/resource'

/**
Placement defines a rule to select a set of ManagedClusters from the ManagedClusterSets bound to the placement namespace. 
Here is how the placement policy combines with other selection methods to determine a matching list of ManagedClusters: 1) Kubernetes clusters are registered with hub as cluster-scoped ManagedClusters; 2) ManagedClusters are organized into cluster-scoped ManagedClusterSets; 3) ManagedClusterSets are bound to workload namespaces; 4) Namespace-scoped Placements specify a slice of ManagedClusterSets which select a working set    of potential ManagedClusters; 5) Then Placements subselect from that working set using label/claim selection. 
No ManagedCluster will be selected if no ManagedClusterSet is bound to the placement namespace. User is able to bind a ManagedClusterSet to a namespace by creating a ManagedClusterSetBinding in that namespace if they have a RBAC rule to CREATE on the virtual subresource of `managedclustersets/bind`. 
A slice of PlacementDecisions with label cluster.open-cluster-management.io/placement={placement name} will be created to represent the ManagedClusters selected by this placement. 
If a ManagedCluster is selected and added into the PlacementDecisions, other components may apply workload on it; once it is removed from the PlacementDecisions, the workload applied on this ManagedCluster should be evicted accordingly.
*/
export type IPlacement = IResource & {
    apiVersion: 'cluster.open-cluster-management.io/v1alpha1'
    kind: 'Placement'
    metadata?: { name?: string; namespace?: string }
    spec: {
        /** 
        ClusterSets represent the ManagedClusterSets from which theManagedClusters are selected. If the slice is empty,
        ManagedClusters will be selected from the ManagedClusterSets bound to the placement namespace, otherwise 
        ManagedClusters will be selected from the intersection of this slice and the ManagedClusterSets bound to the placement namespace.
         */
        clusterSets?: string[]

        /**
            NumberOfClusters represents the desired number of
            ManagedClusters to be selected which meet the placement
            requirements. 1) If not specified, all ManagedClusters which
            meet the placement requirements (including ClusterSets,   
            and Predicates) will be selected; 2) Otherwise if the nubmer
            of ManagedClusters meet the placement requirements is larger
            than    NumberOfClusters, a random subset with desired
            number of ManagedClusters will be selected; 3) If the nubmer
            of ManagedClusters meet the placement requirements is equal
            to NumberOfClusters,    all of them will be selected; 4) If
            the nubmer of ManagedClusters meet the placement
            requirements is less than NumberOfClusters,    all of them
            will be selected, and the status of condition
            `PlacementConditionSatisfied` will be    set to false;
        */
        numberOfClusters?: number

        /**
        Predicates represent a slice of predicates to select ManagedClusters.
        The predicates are ORed.
         */
        predicates: {
            /** RequiredClusterSelector represents a selector of ManagedClusters by label and claim. */
            requiredClusterSelector: {
                /** LabelSelector represents a selector of ManagedClusters by label */
                labelSelector?: {
                    matchLabels?: { [key: string]: string }
                    matchExpressions?: {
                        key: string
                        operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist'
                        values?: string[]
                    }
                }
                /** ClaimSelector represents a selector of ManagedClusters by clusterClaims in status */
                claimSelector?: {
                    matchExpressions: {
                        key: string
                        operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist'
                        values: string[]
                    }
                }
            }
        }[]
    }
}

const placementLocalCluster: IPlacement = {
    apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
    kind: 'Placement',
    metadata: { name: '', namespace: '' },
    spec: {
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
}

export type IClusterSetBinding = IResource & {
    spec: {
        clusterSet: string
    }
}

export function PlacementSection(props: { clusterSetBindings: IClusterSetBinding[]; bindingKind: string; bindingApiGroup?: string }) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    const hasPlacement = resources?.find((resource) => resource.kind === 'Placement') !== undefined
    const hasPlacementRules = resources?.find((resource) => resource.kind === 'PlacementRule') !== undefined
    const hasPlacementBindings = resources?.find((resource) => resource.kind === 'PlacementBinding') !== undefined
    const editMode = useEditMode()
    return (
        <Fragment>
            {editMode === EditMode.Create && (
                <Fragment>
                    <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
                    <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" />
                </Fragment>
            )}
            <Section label="Cluster placement" autohide={false} hidden={() => hasPlacement || hasPlacementRules || hasPlacementBindings}>
                <Tile
                    title="Deploy to clusters with specific labels"
                    onClick={() => {
                        resources.push({
                            apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                            kind: 'Placement',
                            metadata: { name: '', namespace: '' },
                            spec: {},
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
                            spec: {},
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
                        resources.push(placementLocalCluster)
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
            </Section>

            <Placement clusterSetBindings={props.clusterSetBindings} bindingKind={props.bindingKind} />
            <PlacementRules />
            <PlacementBindings />
        </Fragment>
    )
}

export function Placement(props: { clusterSetBindings: IClusterSetBinding[]; bindingKind: string }) {
    const resources = useItem() as IResource[]
    const namespaceClusterSetNames = useMemo(() => {
        if (!resources.find) return []
        const source = resources?.find((resource) => resource.kind === props.bindingKind)
        if (!source) return []
        const namespace = source.metadata?.namespace
        if (!namespace) return []
        return (
            props.clusterSetBindings
                ?.filter((clusterSetBinding) => clusterSetBinding.metadata?.namespace === namespace)
                .map((clusterSetBinding) => clusterSetBinding.spec.clusterSet) ?? []
        )
    }, [props.bindingKind, props.clusterSetBindings, resources])
    return (
        <Section label="Placement" description="A placement selects clusters from the cluster sets which have bindings to the namespace.">
            <ItemSelector selectKey="kind" selectValue="Placement" empty={<Fragment />}>
                {/* <TextInput label="Placement name" path="metadata.name" required labelHelp="Name needs to be unique to the namespace." /> */}
                <Multiselect
                    label="Cluster sets"
                    path="spec.clusterSets"
                    placeholder="Select the cluster sets"
                    labelHelp="The cluster sets from which the clusters are selected."
                    helperText="If no cluster sets are selected, all clusters will be selected from the cluster sets bound to the namespace."
                >
                    {namespaceClusterSetNames.map((name) => (
                        <SelectOption key={name} value={name} />
                    ))}
                </Multiselect>
                <ArrayInput
                    label="Predicates"
                    path="spec.predicates"
                    placeholder="Add predicate"
                    collapsedContent="name"
                    helperText="
                    A predicate further selects clusters from the clusters selected from the placement cluster sets.
                    A placement can have multiple predicates.
                    Clusters matching any predicate will be selected.
                    Clusters must match all predicate selectors and expressions to be selected by that predicate.
                    This allows complex 'And/Or' logic for selecting clusters.
                    "
                    defaultCollapsed
                >
                    <KeyValue
                        label="Cluster label selectors"
                        path="requiredClusterSelector.labelSelector.matchLabels"
                        labelHelp="A label selector allows simple selection of clusters using cluster labels."
                        placeholder="Add label selector"
                    />
                    <ArrayInput
                        label="Cluster label expressions"
                        path="requiredClusterSelector.labelSelector.matchExpressions"
                        placeholder="Add label expression"
                        labelHelp="A label expression allows selection of clusters using cluster labels."
                        collapsedContent={<MatchExpressionSummary />}
                        newValue={{ key: '', operator: 'In' }}
                    >
                        <MatchExpression />
                    </ArrayInput>
                    <ArrayInput
                        label="Cluster claim expressions"
                        path="requiredClusterSelector.claimSelector.matchExpressions"
                        placeholder="Add claim expression"
                        labelHelp="A label expression allows selection of clusters using cluster claims in status."
                        collapsedContent={<MatchExpressionSummary />}
                        newValue={{ key: '', operator: 'In' }}
                    >
                        <MatchExpression />
                    </ArrayInput>
                </ArrayInput>
            </ItemSelector>
        </Section>
    )
}

export function PlacementRules() {
    return (
        <Section label="Placement rules" description="A placement rule selects clusters.">
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
                // hidden={(resources: IResource[]) => resources?.find((resource) => resource.kind === 'PlacementRule') === undefined}
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
                    label="Label selectors"
                    path="spec.clusterSelector.matchExpressions"
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
                                <TextDetail path="value" />
                            </SplitItem>
                        </Split>
                    }
                    newValue={{ key: '', operator: 'In', value: [] }}
                >
                    <MatchExpression />
                </ArrayInput>
            </ArrayInput>
        </Section>
    )
}

export function PlacementBindings() {
    return (
        <Section label="Placement bindings" description="A placement rule selects clusters.">
            <ArrayInput
                id="placement-bindings"
                label="Placement bindings"
                labelHelp="Placement bindings bind a ..."
                path={null}
                filter={(resource) => resource.kind === 'PlacementBinding'}
                placeholder="Add placement binding"
                collapsedContent="metadata.name"
                collapsedPlaceholder="Expand to enter placement binding"
                newValue={{
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'PlacementBinding',
                    metadata: { name: 'local-cluster', namespace: '' },
                    placementRef: { name: 'local-cluster', kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                    subjects: [{ name: 'local-cluster', kind: 'PolicySet', apiGroup: 'policy.open-cluster-management.io' }],
                }}
                // hidden={(resources: IResource[]) => resources?.find((resource) => resource.kind === 'PlacementBinding') === undefined}
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
                    label="Label selectors"
                    path="spec.clusterSelector.matchExpressions"
                    placeholder="Add label selector"
                    collapsedContent={<MatchExpressionSummary />}
                    newValue={{ key: '', operator: 'In' }}
                >
                    <MatchExpression />
                </ArrayInput>
            </ArrayInput>
        </Section>
    )
}

export function Sync(props: { kind: string; path: string; targetKind?: string; targetPath?: string }) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    const [value, setValue] = useState('')

    useEffect(() => {
        let changed = false
        for (const resource of resources) {
            if ((props.targetKind === undefined && resource.kind !== props.kind) || resource.kind === props.targetKind) {
                const existingValue = get(resource, props.targetPath ?? props.path)
                if (value && existingValue !== value) {
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

function MatchExpression() {
    return (
        <Fragment>
            <TextInput label="Key" path="key" required />
            <Select
                label="Operator"
                path="operator"
                options={[
                    { label: 'equals one of', value: 'In' },
                    { label: 'does not equal any of', value: 'NotIn' },
                    { label: 'exists', value: 'Exists' },
                    { label: 'does not exist', value: 'DoesNotExist' },
                ]}
            />
            <StringsInput label="Values" path="values" hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)} />
        </Fragment>
    )
}

function MatchExpressionSummary() {
    return (
        <Split hasGutter>
            <SplitItem>
                <TextDetail path="key" />
            </SplitItem>
            <SplitItem>
                <TextDetail path="operator" />
            </SplitItem>
            <SplitItem>
                <TextDetail path="value" />
            </SplitItem>
        </Split>
    )
}
