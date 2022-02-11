import { Label, SelectOption, Text, Tile } from '@patternfly/react-core'
import { Fragment, useMemo } from 'react'
import { ArrayInput, EditMode, ItemSelector, KeyValue, NumberInput, Section, Select, StringsInput, TextInput } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { Multiselect } from '../../src/inputs/Multiselect'
import { IResource } from '../common/resource'
import { Sync } from '../common/Sync'

/**
Placement defines a rule to select a set of ManagedClusters from the ManagedClusterSets bound to the placement namespace. 
Here is how the placement policy combines with other selection methods to determine a matching list of ManagedClusters: 1) Kubernetes clusters are registered with hub as cluster-scoped ManagedClusters; 2) ManagedClusters are organized into cluster-scoped ManagedClusterSets; 3) ManagedClusterSets are bound to workload namespaces; 4) Namespace-scoped Placements specify a slice of ManagedClusterSets which select a working set    of potential ManagedClusters; 5) Then Placements subselect from that working set using label/claim selection. 
No ManagedCluster will be selected if no ManagedClusterSet is bound to the placement namespace. User is able to bind a ManagedClusterSet to a namespace by creating a ManagedClusterSetBinding in that namespace if they have a RBAC rule to CREATE on the virtual subresource of `managedclustersets/bind`. 
A slice of PlacementDecisions with label cluster.open-cluster-management.io/placement={placement name} will be created to represent the ManagedClusters selected by this placement. 
If a ManagedCluster is selected and added into the PlacementDecisions, other components may apply workload on it; once it is removed from the PlacementDecisions, the workload applied on this ManagedCluster should be evicted accordingly.
*/
export type IPlacement = IResource & {
    apiVersion?: 'cluster.open-cluster-management.io/v1alpha1'
    kind?: 'Placement'
    metadata?: { name?: string; namespace?: string }
    spec?: {
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
        predicates?: Predicate[]
    }
}

interface Predicate {
    /** RequiredClusterSelector represents a selector of ManagedClusters by label and claim. */
    requiredClusterSelector?: {
        /** LabelSelector represents a selector of ManagedClusters by label */
        labelSelector?: {
            matchLabels?: { [key: string]: string }
            matchExpressions?: IExpression[]
        }
        /** ClaimSelector represents a selector of ManagedClusters by clusterClaims in status */
        claimSelector?: {
            matchExpressions?: IExpression[]
        }
    }
}

interface IExpression {
    key?: string
    operator?: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist'
    values?: string[]
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

export function PlacementSection(props: {
    clusterSetBindings: IClusterSetBinding[]
    bindingSubjectKind: string
    bindingSubjectApiGroup?: string
    placements: IResource[]
    placementRules: IResource[]
}) {
    const resources = useItem() as IResource[]
    const { update } = useData()
    const placementCount = resources?.filter((resource) => resource.kind === 'Placement').length
    const hasPlacement = placementCount !== 0
    const hasPlacementRules = resources?.find((resource) => resource.kind === 'PlacementRule') !== undefined
    const hasPlacementBindings = resources?.find((resource) => resource.kind === 'PlacementBinding') !== undefined
    const editMode = useEditMode()
    return (
        <Fragment>
            {editMode === EditMode.Create && (
                <Fragment>
                    <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
                </Fragment>
            )}
            <Section
                label="Which clusters would you like to deploy the resources?"
                autohide={false}
                hidden={() => hasPlacement || hasPlacementRules || hasPlacementBindings}
            >
                <Tile
                    title="Deploy to clusters with specific labels"
                    onClick={() => {
                        resources.push({
                            apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                            kind: 'Placement',
                            metadata: { name: '', namespace: '' },
                            spec: {},
                        } as IResource)
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name: '', namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
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
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name, namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
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
                        if (props.bindingSubjectKind) {
                            resources.push({
                                apiVersion: 'policy.open-cluster-management.io/v1',
                                kind: 'PlacementBinding',
                                metadata: { name, namespace: '' },
                                placementRef: { name, kind: 'Placement', apiGroup: 'cluster.open-cluster-management.io' },
                                subjects: [{ name, kind: props.bindingSubjectKind, apiGroup: props.bindingSubjectApiGroup }],
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
            <Placements
                clusterSetBindings={props.clusterSetBindings}
                bindingKind={props.bindingSubjectKind}
                placementCount={placementCount}
            />
            <PlacementRules hasPlacement={hasPlacement} hasPlacementRules={hasPlacementRules} hasPlacementBindings={hasPlacementBindings} />
            <PlacementBindings
                hasPlacement={hasPlacement}
                hasPlacementRules={hasPlacementRules}
                hasPlacementBindings={hasPlacementBindings}
                bindingSubjectKind={props.bindingSubjectKind}
                bindingSubjectApiGroup={props.bindingSubjectApiGroup}
                placements={props.placements}
                placementRules={props.placementRules}
            />
        </Fragment>
    )
}

export function Placements(props: { clusterSetBindings: IClusterSetBinding[]; bindingKind: string; placementCount: number }) {
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
    const editMode = useEditMode()

    if (editMode === EditMode.Create && props.placementCount <= 1) {
        return (
            <Section
                label="Cluster placement"
                description="Placement selects clusters from the cluster sets which have bindings to the resource namespace."
            >
                <ItemSelector selectKey="kind" selectValue="Placement">
                    <Placement namespaceClusterSetNames={namespaceClusterSetNames} />
                </ItemSelector>
            </Section>
        )
    }
    return (
        <ArrayInput
            id="placements"
            label="Placements"
            helperText="A placement selects clusters from the cluster sets which have bindings to the resource namespace."
            path={null}
            isSection
            filter={(resource) => resource.kind === 'Placement'}
            placeholder="Add placement"
            collapsedContent="metadata.name"
            collapsedPlaceholder="Expand to enter placement"
            newValue={{
                apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                kind: 'Placement',
                metadata: { name: '', namespace: '' },
                spec: {},
            }}
            defaultCollapsed
        >
            <Placement namespaceClusterSetNames={namespaceClusterSetNames} />
        </ArrayInput>
    )
}

export function Placement(props: { namespaceClusterSetNames: string[] }) {
    return (
        <Fragment>
            {/* <TextInput label="Placement name" path="metadata.name" required labelHelp="Name needs to be unique to the namespace." /> */}
            <Multiselect
                label="Cluster sets"
                path="spec.clusterSets"
                placeholder="Select the cluster sets"
                labelHelp="The cluster sets from which the clusters are selected."
                helperText="If no cluster sets are selected, all clusters will be selected from the cluster sets bound to the namespace."
            >
                {props.namespaceClusterSetNames.map((name) => (
                    <SelectOption key={name} value={name} />
                ))}
            </Multiselect>

            <ArrayInput
                label="Cluster selectors"
                path="spec.predicates"
                placeholder="Add cluster selector"
                collapsedContent={<PredicateSummary />}
                helperText="
            A cluster selector further selects clusters from the clusters in the cluster sets which have bindings to the namespace.
            Clusters matching any cluster selector will be selected.
            Clusters must match all cluster selector criteria to be selected by that cluster selector.
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
                    collapsedContent={<MatchExpressionCollapsed />}
                    newValue={{ key: '', operator: 'In' }}
                    defaultCollapsed
                >
                    <MatchExpression />
                </ArrayInput>
                <ArrayInput
                    label="Cluster claim expressions"
                    path="requiredClusterSelector.claimSelector.matchExpressions"
                    placeholder="Add claim expression"
                    labelHelp="A label expression allows selection of clusters using cluster claims in status."
                    collapsedContent={<MatchExpressionCollapsed />}
                    newValue={{ key: '', operator: 'In' }}
                    defaultCollapsed
                >
                    <MatchExpression />
                </ArrayInput>
            </ArrayInput>
            <NumberInput label="Limit the number of clusters selected" path="spec.numberOfClusters" zeroIsUndefined />
        </Fragment>
    )
}

export function PlacementRules(props: { hasPlacement: boolean; hasPlacementRules: boolean; hasPlacementBindings: boolean }) {
    return (
        <ArrayInput
            id="placement-rules"
            label="Placement rules"
            labelHelp="Placement rules determine which clusters a resources will be applied."
            path={null}
            isSection
            hidden={() => !props.hasPlacementRules}
            filter={(resource) => resource.kind === 'PlacementRule'}
            placeholder="Add placement rule"
            collapsedContent="metadata.name"
            collapsedPlaceholder="Expand to enter placement rule"
            newValue={{
                apiVersion: 'apps.open-cluster-management.io/v1',
                kind: 'PlacementRule',
                metadata: {},
                spec: {
                    clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' },
                    clusterSelector: {
                        matchExpressions: [{ key: '', operator: 'In', values: [''] }],
                    },
                },
            }}
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
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In' }}
            >
                <MatchExpression />
            </ArrayInput>
        </ArrayInput>
    )
}

export function PlacementBindings(props: {
    hasPlacement: boolean
    hasPlacementRules: boolean
    hasPlacementBindings: boolean
    bindingSubjectKind: string
    bindingSubjectApiGroup?: string
    placements: IResource[]
    placementRules: IResource[]
}) {
    const editMode = useEditMode()
    return (
        <ArrayInput
            id="placement-bindings"
            label="Placement bindings"
            helperText="To apply a resource to a cluster, the placement must be bound to the resource using a placement binding."
            path={null}
            filter={(resource) => resource.kind === 'PlacementBinding'}
            placeholder="Add placement binding"
            collapsedContent="metadata.name"
            collapsedPlaceholder="Expand to enter binding"
            defaultCollapsed
            isSection
            hidden={() => {
                if (editMode === EditMode.Create) return true
                return !props.hasPlacement && !props.hasPlacementRules && !props.hasPlacementBindings
            }}
            newValue={{
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'PlacementBinding',
                metadata: {},
                placementRef: { apiGroup: 'cluster.open-cluster-management.io', kind: 'Placement' },
                subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
            }}
            dropdownItems={
                props.hasPlacementRules
                    ? [
                          {
                              label: 'Add placement binding',
                              action: () => ({
                                  apiVersion: 'policy.open-cluster-management.io/v1',
                                  kind: 'PlacementBinding',
                                  metadata: {},
                                  placementRef: { apiGroup: 'cluster.open-cluster-management.io', kind: 'Placement' },
                                  subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
                              }),
                          },
                          {
                              label: 'Add placement rule binding',
                              action: () => ({
                                  apiVersion: 'policy.open-cluster-management.io/v1',
                                  kind: 'PlacementBinding',
                                  metadata: {},
                                  placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                                  subjects: [{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }],
                              }),
                          },
                      ]
                    : undefined
            }
        >
            <TextInput path="metadata.name" label="Binding name" required />
            {/* <TextInput path="placementRef.name" label="Placement name" required readonly={true} /> */}
            <Select
                path="placementRef.kind"
                label="Placement kind"
                helperText="The placement rule used to select clusters for placement."
                required
                options={['Placement', 'PlacementRule']}
            />
            <Select
                path="placementRef.name"
                label="Placement"
                helperText="The placement used to select clusters."
                required
                hidden={(binding) => binding.placementRef?.kind !== 'Placement'}
                options={props.placements.map((placement) => placement.metadata?.name ?? '')}
            />
            <Select
                path="placementRef.name"
                label="Placement rule"
                helperText="The placement rule used to select clusters for placement."
                required
                hidden={(binding) => binding.placementRef?.kind !== 'PlacementRule'}
                options={props.placementRules.map((placement) => placement.metadata?.name ?? '')}
            />
            <ArrayInput
                path="subjects"
                label="Subjects"
                helperText="Placement bindings can have multiple subjects which the placement is applied to."
                placeholder="Add placement subject"
                collapsedContent="name"
                collapsedPlaceholder="Expand to enter subject"
                newValue={{ apiGroup: props.bindingSubjectApiGroup, kind: props.bindingSubjectKind }}
            >
                <Select path="kind" label="Subject kind" required options={['PolicySet', 'Policy']} />
                <TextInput path="name" label="Subject name" required />
            </ArrayInput>
        </ArrayInput>
    )
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

function PredicateSummary() {
    const predicate = useItem() as Predicate
    const labelSelectorLabels = predicate.requiredClusterSelector?.labelSelector?.matchLabels ?? {}
    const labelSelectorExpressions = predicate.requiredClusterSelector?.labelSelector?.matchExpressions ?? []
    const claimSelectorExpressions = predicate.requiredClusterSelector?.claimSelector?.matchExpressions ?? []

    const labelSelectors: string[] = []
    const labelExpressions: string[] = []
    const claimExpressions: string[] = []

    for (const matchLabel in labelSelectorLabels) {
        labelSelectors.push(`${matchLabel}=${labelSelectorLabels[matchLabel]}`)
    }

    for (const matchExpression of labelSelectorExpressions) {
        labelExpressions.push(`${matchExpression.key ?? ''} ${matchExpression.operator ?? ''} ${matchExpression.values?.join(', ') ?? ''}`)
    }

    for (const claimExpression of claimSelectorExpressions) {
        claimExpressions.push(`${claimExpression.key ?? ''} ${claimExpression.operator ?? ''} ${claimExpression.values?.join(', ') ?? ''}`)
    }

    if (labelSelectors.length === 0 && claimSelectorExpressions.length === 0) {
        return <div>Expand to enter predicate</div>
    }

    return (
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
            {labelSelectors.length > 0 && (
                <div style={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Text component="small">Cluster labels</Text>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'baseline', flexWrap: 'wrap' }}>
                        {labelSelectors.map((labelSelector) => (
                            <Label key={labelSelector}>{labelSelector}</Label>
                        ))}
                    </div>
                </div>
            )}
            {labelSelectorExpressions.length > 0 && (
                <div style={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Text component="small">Cluster claim label expressions</Text>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'baseline', flexWrap: 'wrap' }}>
                        {labelSelectorExpressions.map((expression, index) => (
                            <MatchExpressionSummary key={index} expression={expression} />
                        ))}
                    </div>
                </div>
            )}
            {claimSelectorExpressions.length > 0 && (
                <div style={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Text component="small">Cluster claim label expressions</Text>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'baseline', flexWrap: 'wrap' }}>
                        {claimSelectorExpressions.map((expression, index) => (
                            <MatchExpressionSummary key={index} expression={expression} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function MatchExpressionCollapsed() {
    const expression = useItem() as IExpression
    return <MatchExpressionSummary expression={expression} />
}

function MatchExpressionSummary(props: { expression: IExpression }) {
    const { expression } = props

    let operator = 'unknown'
    switch (expression.operator) {
        case 'In':
            if (expression.values && expression.values.length > 1) {
                operator = 'equals any of'
            } else {
                operator = 'equals'
            }
            break
        case 'NotIn':
            if (expression.values && expression.values.length > 1) {
                operator = 'does not equal any of'
            } else {
                operator = 'does not equal'
            }
            break
        case 'Exists':
            operator = 'exists'
            break
        case 'DoesNotExist':
            operator = 'does not exist'
            break
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'baseline',
                border: '1px solid #0003',
                padding: '0px 6px 2px 3px',
                gap: 4,
                borderRadius: 12,
                flexWrap: 'wrap',
            }}
        >
            <Label isCompact>{expression.key}</Label>
            <span style={{ whiteSpace: 'nowrap', opacity: 0.7 }}>
                <Text component="small">{operator}</Text>
            </span>
            {expression.values && expression.values.join(', ')}
        </div>
    )
}
