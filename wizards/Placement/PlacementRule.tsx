import get from 'get-value'
import { Fragment, useMemo } from 'react'
import { ArrayInput, EditMode, KeyValue } from '../../src'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'
import { useLabelValuesMap } from '../common/useLabelValuesMap'
import { MatchExpression, MatchExpressionCollapsed } from './MatchExpression'

export function PlacementRules(props: { clusters: IResource[] }) {
    const editMode = useEditMode()
    return (
        <ArrayInput
            id="placement-rules"
            label="Placement rules"
            labelHelp="Placement rules determine which clusters a resources will be applied."
            path={null}
            isSection
            // hidden={() => !props.placementRuleCount }
            filter={(resource) => resource.kind === PlacementRuleKind}
            placeholder="Add placement rule"
            collapsedContent="metadata.name"
            collapsedPlaceholder="Expand to enter placement rule"
            newValue={{
                ...PlacementRuleType,
                metadata: {},
                spec: { clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' } },
            }}
            defaultCollapsed={editMode !== EditMode.Create}
        >
            <PlacementRule clusters={props.clusters} />
        </ArrayInput>
    )
}

export function PlacementRule(props: { clusters: IResource[] }) {
    const editMode = useEditMode()
    const labelValuesMap = useLabelValuesMap(props.clusters)
    const item = useItem()
    const labelSelectorMatchLabels = useMemo(() => get(item, `spec.clusterSelector.matchLabels`), [item])
    const inputLabel = useMemo(() => {
        if (labelSelectorMatchLabels) return 'Label expressions'
        return 'Label selectors'
    }, [labelSelectorMatchLabels])
    const addLabel = useMemo(() => {
        if (labelSelectorMatchLabels) return 'Add label expressions'
        return 'Add selector'
    }, [labelSelectorMatchLabels])
    return (
        <Fragment>
            {/* <TextInput
                id="name"
                path="metadata.name"
                label="Name"
                required
                helperText="The name of the placement rule should match the rule name in a placement binding so that it is bound to a policy."
            /> */}
            <KeyValue
                label="Cluster label selector"
                path={`spec.clusterSelector.matchLabels`}
                labelHelp="A cluster label selector allows simple selection of clusters using cluster labels."
                placeholder="Add cluster label selector"
                hidden={(item) => get(item, `spec.clusterSelector.matchLabels`) === undefined}
            />
            <ArrayInput
                id="label-expressions"
                label={inputLabel}
                path="spec.clusterSelector.matchExpressions"
                placeholder={addLabel}
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In', values: [] }}
                defaultCollapsed={editMode !== EditMode.Create}
            >
                <MatchExpression labelValuesMap={labelValuesMap} />
            </ArrayInput>
        </Fragment>
    )
}
