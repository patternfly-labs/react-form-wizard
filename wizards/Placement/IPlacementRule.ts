import { IResource } from '../common/resource'
import { IExpression } from './IMatchExpression'

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
