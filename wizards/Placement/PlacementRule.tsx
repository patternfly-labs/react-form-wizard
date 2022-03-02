import get from 'get-value'
import { Fragment } from 'react'
import { ArrayInput, EditMode, KeyValue } from '../../src'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'
import { MatchExpression, MatchExpressionCollapsed } from './MatchExpression'

export function PlacementRules() {
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
            <PlacementRule />
        </ArrayInput>
    )
}

export function PlacementRule() {
    const editMode = useEditMode()
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
                label="Cluster label expression"
                path="spec.clusterSelector.matchExpressions"
                placeholder="Add cluster label expression"
                collapsedContent={<MatchExpressionCollapsed />}
                newValue={{ key: '', operator: 'In', values: [''] }}
                defaultCollapsed={editMode !== EditMode.Create}
            >
                <MatchExpression />
            </ArrayInput>
        </Fragment>
    )
}
