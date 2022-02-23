import { SelectOption } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useMemo } from 'react'
import { ArrayInput, EditMode, Hidden, ItemSelector, KeyValue, NumberInput } from '../../src'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { Multiselect } from '../../src/inputs/Multiselect'
import { IResource } from '../common/resource'
import { Sync } from '../common/Sync'
import { IClusterSetBinding } from './ClusterSetBinding'
import { IExpression, MatchExpression, MatchExpressionCollapsed, MatchExpressionSummary } from './MatchExpression'

export const PlacementApiVersion = 'cluster.open-cluster-management.io/v1beta1'
export const PlacementKind = 'Placement'
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

export interface Predicate {
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

export function Placements(props: {
    clusterSetBindings: IClusterSetBinding[]
    bindingKind: string
    placementCount: number
    showPlacementRules: boolean
    showPlacementBindings: boolean
}) {
    const editMode = useEditMode()
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

    if (!props.showPlacementRules && !props.showPlacementBindings && props.placementCount === 1) {
        return (
            <Fragment>
                <Sync kind="Placement" path="metadata.name" targetKind="PlacementBinding" targetPath="placementRef.name" />
                <ItemSelector selectKey="kind" selectValue="Placement">
                    <Placement namespaceClusterSetNames={namespaceClusterSetNames} />
                </ItemSelector>
            </Fragment>
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
                apiVersion: PlacementApiVersion,
                kind: 'Placement',
                metadata: { name: '', namespace: '' },
                spec: {},
            }}
            defaultCollapsed={editMode === EditMode.Edit}
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
    const editMode = useEditMode()
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
                defaultCollapsed={editMode !== EditMode.Create}
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
                defaultCollapsed={editMode !== EditMode.Create}
                hidden={(item) => get(item, `${rootPath}requiredClusterSelector.claimSelector.matchExpressions`) === undefined}
            >
                <MatchExpression />
            </ArrayInput>
        </Fragment>
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
