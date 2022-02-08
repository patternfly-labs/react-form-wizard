import { SelectOption, Split, SplitItem, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useEffect, useMemo, useState } from 'react'
import set from 'set-value'
import { ArrayInput, Hidden, ItemSelector, KeyValue, Section, Select, StringsInput, TextDetail, TextInput } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useItem } from '../../src/contexts/ItemContext'
import { Multiselect } from '../../src/inputs/Multiselect'
import { IResource } from '../common/resource'

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
    return (
        <Fragment>
            <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
            <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" />
            <Section label="Cluster placement" autohide={false}>
                <Hidden hidden={() => hasPlacement || hasPlacementRules || hasPlacementBindings}>
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

                <Placement clusterSetBindings={props.clusterSetBindings} bindingKind={props.bindingKind} />

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
                        <TextInput label="Label" path="key" />
                        <Select
                            label="Operator"
                            path="operator"
                            options={[
                                { label: 'is one of', value: 'In' },
                                { label: 'is not any of', value: 'NotIn' },
                                'Exists',
                                'DoesNotExist',
                            ]}
                        />
                        <StringsInput
                            label="Values"
                            path="values"
                            hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)}
                        />
                    </ArrayInput>
                </ArrayInput>
            </Section>
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
        <ItemSelector selectKey="kind" selectValue="Placement" empty={<Fragment />}>
            {/* <TextInput label="Placement name" path="metadata.name" required labelHelp="Name needs to be unique to the namespace." /> */}
            {/* <Multiselect
                label="Cluster sets"
                path="spec.clusterSets"
                placeholder="All clusters from cluster sets bound to the namespace"
                options={namespaceClusterSetNames}
                labelHelp="The cluster sets from which the clusters are selected. If no cluster sets are selected, all clusters will be selected from the cluster sets bound to the namespace."
            /> */}
            <Multiselect
                label="Cluster sets"
                path="spec.clusterSets"
                placeholder="All clusters from cluster sets bound to the namespace"
                labelHelp="The cluster sets from which the clusters are selected. If no cluster sets are selected, all clusters will be selected from the cluster sets bound to the namespace."
            >
                {namespaceClusterSetNames.map((name) => (
                    <SelectOption key={name} value={name} />
                ))}
            </Multiselect>
            <KeyValue
                label="Cluster labels"
                path="spec.predicates.0.labelSelector.matchLabels"
                labelHelp="If no cluster labels are entered, all clusters will be selected from the cluster sets"
                placeholder="Add cluster label"
            />
        </ItemSelector>
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
