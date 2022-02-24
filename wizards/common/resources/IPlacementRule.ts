import { IResource } from '../resource'
import { IExpression } from './IMatchExpression'

export const PlacementRuleApiGroup = 'apps.open-cluster-management.io'
export const PlacementRuleApiVersion = `${PlacementRuleApiGroup}/v1`
export const PlacementRuleKind = 'PlacementRule'
export const PlacementRuleType = { apiVersion: PlacementRuleApiVersion, kind: PlacementRuleKind }

export type IPlacementRule = IResource & {
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
