import { IClusterSetBinding } from '../Placement/PlacementSection'
import { IResource } from './resource'

export const namespaces = ['default', 'my-namespace-1', 'my-namespace-2']

export const policies: IResource[] = [
    { kind: 'Policy', metadata: { name: 'my-policy-1', namespace: 'my-namespace-1' } },
    { kind: 'Policy', metadata: { name: 'my-policy-2', namespace: 'my-namespace-1' } },
    { kind: 'Policy', metadata: { name: 'my-policy-3', namespace: 'my-namespace-2' } },
    { kind: 'Policy', metadata: { name: 'my-policy-4', namespace: 'my-namespace-2' } },
]

export const clusterSetBindings: IClusterSetBinding[] = [
    {
        kind: 'ManagedClusterSetBinding',
        metadata: { name: 'my-cluster-set-1-binding', namespace: 'my-namespace-1' },
        spec: { clusterSet: 'my-cluster-set-1' },
    },
    {
        kind: 'ManagedClusterSetBinding',
        metadata: { name: 'my-cluster-set-2-binding', namespace: 'my-namespace-1' },
        spec: { clusterSet: 'my-cluster-set-2' },
    },
    {
        kind: 'ManagedClusterSetBinding',
        metadata: { name: 'my-cluster-set-3-binding', namespace: 'my-namespace-2' },
        spec: { clusterSet: 'my-cluster-set-3' },
    },
    {
        kind: 'ManagedClusterSetBinding',
        metadata: { name: 'my-cluster-set-4-binding', namespace: 'my-namespace-2' },
        spec: { clusterSet: 'my-cluster-set-4' },
    },
]

export const placements: IResource[] = [
    { kind: 'Placement', metadata: { name: 'my-placement-1', namespace: 'my-namespace-1' } },
    { kind: 'Placement', metadata: { name: 'my-placement-2', namespace: 'my-namespace-1' } },
    { kind: 'Placement', metadata: { name: 'my-placement-3', namespace: 'my-namespace-2' } },
    { kind: 'Placement', metadata: { name: 'my-placement-4', namespace: 'my-namespace-2' } },
]

export const placementRules: IResource[] = [
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-1', namespace: 'my-namespace-1' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-2', namespace: 'my-namespace-1' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-3', namespace: 'my-namespace-2' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-4', namespace: 'my-namespace-2' } },
]
