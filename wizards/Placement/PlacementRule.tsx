import get from 'get-value'
import { ArrayInput, KeyValue, TextInput } from '../../src'
import { IResource } from '../common/resource'
import { IExpression, MatchExpression, MatchExpressionCollapsed } from './MatchExpression'

export type IPlacementRule = IResource & {
    apiVersion?: 'cluster.open-cluster-management.io/v1beta1'
    kind?: 'PlacementRule'
    metadata?: { name?: string; namespace?: string }
    spec?: {
        clusterConditions?: {
            status: string
            type: string
        }[]
        clusterReplicas: number
        clusterSelector: {
            matchExpressions: IExpression[]
            matchLabels: Record<string, string>
        }
        clusters: { name: string }[]
        policies: {
            apiVersion: string
            fieldPath: string
            kind: string
            name: string
            namespace: string
            resourceVersion: string
            uid: string
        }[]
        resourceHint: { order: string; type: string }
        schedulerName: string
    }
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
