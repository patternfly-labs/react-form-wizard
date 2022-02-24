import { IPlacement, PlacementType } from '../common/resources/IPlacement'
import { IPlacementRule, PlacementRuleType } from '../common/resources/IPlacementRule'
import { IResource } from './resource'
import { ClusterSetBindingType, IClusterSetBinding } from './resources/IClusterSetBinding'
import { PolicyType } from './resources/IPolicy'

export const namespaces = ['default', 'my-namespace-1', 'my-namespace-2']

export const policies: IResource[] = [
    { ...PolicyType, metadata: { name: 'my-policy-1', namespace: 'my-namespace-1' } },
    { ...PolicyType, metadata: { name: 'my-policy-2', namespace: 'my-namespace-1' } },
    { ...PolicyType, metadata: { name: 'my-policy-3', namespace: 'my-namespace-2' } },
    { ...PolicyType, metadata: { name: 'my-policy-4', namespace: 'my-namespace-2' } },
]

export const clusterSetBindings: IClusterSetBinding[] = [
    {
        ...ClusterSetBindingType,
        metadata: { name: 'my-cluster-set-1-binding', namespace: 'my-namespace-1' },
        spec: { clusterSet: 'my-cluster-set-1' },
    },
    {
        ...ClusterSetBindingType,
        metadata: { name: 'my-cluster-set-2-binding', namespace: 'my-namespace-1' },
        spec: { clusterSet: 'my-cluster-set-2' },
    },
    {
        ...ClusterSetBindingType,
        metadata: { name: 'my-cluster-set-3-binding', namespace: 'my-namespace-2' },
        spec: { clusterSet: 'my-cluster-set-3' },
    },
    {
        ...ClusterSetBindingType,
        metadata: { name: 'my-cluster-set-4-binding', namespace: 'my-namespace-2' },
        spec: { clusterSet: 'my-cluster-set-4' },
    },
]

export const placements: IPlacement[] = [
    { ...PlacementType, metadata: { name: 'my-placement-1', namespace: 'my-namespace-1' } },
    { ...PlacementType, metadata: { name: 'my-placement-2', namespace: 'my-namespace-1' } },
    { ...PlacementType, metadata: { name: 'my-placement-3', namespace: 'my-namespace-2' } },
    { ...PlacementType, metadata: { name: 'my-placement-4', namespace: 'my-namespace-2' } },
    { ...PlacementType, metadata: { name: 'my-placement-5', namespace: 'server-1' } },
    { ...PlacementType, metadata: { name: 'my-placement-6', namespace: 'server-1' } },
]

export const placementRules: IPlacementRule[] = [
    { ...PlacementRuleType, metadata: { name: 'my-placement-rule-1', namespace: 'my-namespace-1' } },
    { ...PlacementRuleType, metadata: { name: 'my-placement-rule-2', namespace: 'my-namespace-1' } },
    { ...PlacementRuleType, metadata: { name: 'my-placement-rule-3', namespace: 'my-namespace-2' } },
    { ...PlacementRuleType, metadata: { name: 'my-placement-rule-4', namespace: 'my-namespace-2' } },
]
