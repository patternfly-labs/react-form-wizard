import get from 'get-value'
import { Fragment } from 'react'
import { ArrayInput, EditMode, ItemSelector, KeyValue } from '../../src'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { PlacementBindingKind } from '../common/resources/IPlacementBinding'
import { PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'
import { Sync } from '../common/Sync'
import { MatchExpression, MatchExpressionCollapsed } from './MatchExpression'

export function PlacementRules(props: { showPlacements: boolean; placementRuleCount: number; showPlacementBindings: boolean }) {
    const editMode = useEditMode()
    if (!props.showPlacements && !props.showPlacementBindings && props.placementRuleCount === 1) {
        return (
            <Fragment>
                <Sync kind={PlacementRuleKind} path="metadata.name" targetKind={PlacementBindingKind} />
                <Sync kind={PlacementRuleKind} path="metadata.namespace" targetKind={PlacementBindingKind} />
                <Sync kind={PlacementRuleKind} path="metadata.name" targetKind={PlacementBindingKind} targetPath="placementRef.name" />
                <ItemSelector selectKey="kind" selectValue={PlacementRuleKind}>
                    <PlacementRule />
                </ItemSelector>
            </Fragment>
        )
    }
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

function PlacementRule() {
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
