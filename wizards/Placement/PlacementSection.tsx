import { Flex, FlexItem, SelectOption, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useMemo } from 'react'
import { ArrayInput, EditMode, Hidden, ItemSelector, KeyValue, NumberInput, Section, Select, StringsInput, TextInput } from '../../src'
import { useData } from '../../src/contexts/DataContext'
import { DisplayMode, useDisplayMode } from '../../src/contexts/DisplayModeContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { Multiselect } from '../../src/inputs/Multiselect'
import { IResource } from '../common/resource'
import { Sync } from '../common/Sync'
import { IExpression } from './IMatchExpression'

/**
Placement defines a rule to select a set of ManagedClusters from the ManagedClusterSets bound to the placement namespace. 
Here is how the placement policy combines with other selection methods to determine a matching list of ManagedClusters: 1) Kubernetes clusters are registered with hub as cluster-scoped ManagedClusters; 2) ManagedClusters are organized into cluster-scoped ManagedClusterSets; 3) ManagedClusterSets are bound to workload namespaces; 4) Namespace-scoped Placements specify a slice of ManagedClusterSets which select a working set    of potential ManagedClusters; 5) Then Placements subselect from that working set using label/claim selection. 
No ManagedCluster will be selected if no ManagedClusterSet is bound to the placement namespace. User is able to bind a ManagedClusterSet to a namespace by creating a ManagedClusterSetBinding in that namespace if they have a RBAC rule to CREATE on the virtual subresource of `managedclustersets/bind`. 
A slice of PlacementDecisions with label cluster.open-cluster-management.io/placement={placement name} will be created to represent the ManagedClusters selected by this placement. 
If a ManagedCluster is selected and added into the PlacementDecisions, other components may apply workload on it; once it is removed from the PlacementDecisions, the workload applied on this ManagedCluster should be evicted accordingly.
*/
export type IPlacement = IResource & {
    apiVersion?: 'cluster.open-cluster-management.io/v1beta1'
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

const placementLocalCluster: IPlacement = {
    apiVersion: 'cluster.open-cluster-management.io/v1beta1',
    kind: 'Placement',
    metadata: { name: '', namespace: '' },
    spec: {
        predicates: [
            {
                requiredClusterSelector: {
                    labelSelector: {
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
                            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
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
                            apiVersion: 'cluster.open-cluster-management.io/v1beta1',
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
                apiVersion: 'cluster.open-cluster-management.io/v1beta1',
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
    const editMode = useEditMode()

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

            <Hidden
                hidden={(placement) => {
                    if (editMode === EditMode.Edit) return true
                    if (!placement.spec?.predicates) return false
                    if (placement.spec.predicates.length <= 1) return false
                    return true
                }}
            >
                <PlacementPredicate rootPath="spec.predicates.0." />
            </Hidden>

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
                hidden={(placement) => {
                    if (editMode === EditMode.Edit) return false
                    if (!placement.spec?.predicates) return true
                    if (placement.spec.predicates.length <= 1) return true
                    return false
                }}
            >
                <PlacementPredicate />
            </ArrayInput>
            <NumberInput
                label="Limit the number of clusters selected"
                path="spec.numberOfClusters"
                zeroIsUndefined
                hidden={(placement) => placement.spec?.numberOfClusterss === undefined}
            />
        </Fragment>
    )
}

export function PlacementPredicate(props: { rootPath?: string }) {
    const rootPath = props.rootPath ?? ''
    return (
        <Fragment>
            <KeyValue
                label="Cluster label selectors"
                path={`${rootPath}requiredClusterSelector.labelSelector.matchLabels`}
                labelHelp="A clsuter label selector allows simple selection of clusters using cluster labels."
                placeholder="Add cluster label selector"
                hidden={(item) => get(item, `${rootPath}requiredClusterSelector.labelSelector.matchLabels`) === undefined}
            />
            <ArrayInput
                label="Cluster label expressions"
                path={`${rootPath}requiredClusterSelector.labelSelector.matchExpressions`}
                placeholder="Add label expression"
                labelHelp="A label expression allows selection of clusters using cluster labels."
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In', values: [''] }}
                defaultCollapsed
            >
                <MatchExpression />
            </ArrayInput>
            <ArrayInput
                label="Cluster claim expressions"
                path={`${rootPath}requiredClusterSelector.claimSelector.matchExpressions`}
                placeholder="Add claim expression"
                labelHelp="A claim expression allows selection of clusters using cluster claims in status."
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In', values: [''] }}
                defaultCollapsed
                hidden={(item) => get(item, `${rootPath}requiredClusterSelector.claimSelector.matchExpressions`) === undefined}
            >
                <MatchExpression />
            </ArrayInput>
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
            <KeyValue
                label="Cluster label selector"
                path={`spec.clusterSelector.matchLabels`}
                labelHelp="A cluster label selector allows simple selection of clusters using cluster labels."
                placeholder="Add cluster label selector"
                hidden={(item) => get(item, `spec.clusterSelector.matchLabels`) === undefined}
            />
            <ArrayInput
                label="Cluster label expression"
                path="spec.clusterSelector.matchExpressions"
                placeholder="Add cluster label expression"
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In', values: [''] }}
                defaultCollapsed
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
        <Flex style={{ rowGap: 16 }}>
            <TextInput label="Label" path="key" required disablePaste />
            <Select
                label=" "
                path="operator"
                options={[
                    { label: 'equals any of', value: 'In' },
                    { label: 'does not equal any of', value: 'NotIn' },
                    { label: 'exists', value: 'Exists' },
                    { label: 'does not exist', value: 'DoesNotExist' },
                ]}
                required
            />
            <FlexItem grow={{ default: 'grow' }}>
                <StringsInput
                    label="Values"
                    path="values"
                    hidden={(labelSelector) => !['In', 'NotIn'].includes(labelSelector.operator)}
                    placeholder="Add value"
                />
            </FlexItem>
        </Flex>
    )
}

function PredicateSummary() {
    const predicate = useItem() as Predicate
    const labelSelectorLabels = predicate.requiredClusterSelector?.labelSelector?.matchLabels ?? {}
    const labelSelectorExpressions = predicate.requiredClusterSelector?.labelSelector?.matchExpressions ?? []
    const claimSelectorExpressions = predicate.requiredClusterSelector?.claimSelector?.matchExpressions ?? []

    const labelSelectors: string[] = []
    for (const matchLabel in labelSelectorLabels) {
        labelSelectors.push(`${matchLabel}=${labelSelectorLabels[matchLabel]}`)
    }

    if (labelSelectors.length === 0 && labelSelectorExpressions.length === 0 && claimSelectorExpressions.length === 0) {
        return <div>Expand to enter details</div>
    }

    return (
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            {labelSelectors.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <div className="pf-c-form__label pf-c-form__label-text">Cluster label selectors</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {labelSelectors.map((labelSelector) => (
                            <span key={labelSelector}>{labelSelector}</span>
                        ))}
                    </div>
                </div>
            )}
            {labelSelectorExpressions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <div className="pf-c-form__label pf-c-form__label-text">Cluster label expressions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {labelSelectorExpressions.map((expression, index) => (
                            <MatchExpressionSummary key={index} expression={expression} />
                        ))}
                    </div>
                </div>
            )}
            {claimSelectorExpressions.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <div className="pf-c-form__label pf-c-form__label-text">Cluster claim expressions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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

    const displayMode = useDisplayMode()

    if (!expression.key) {
        if (displayMode === DisplayMode.Details) return <Fragment />
        return <div>Expand to enter expression</div>
    }

    return (
        <div>
            {expression.key} {operator} {expression.values?.map((value) => value).join(', ')}
        </div>
    )
}
