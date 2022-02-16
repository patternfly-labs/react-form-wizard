import { useHistory } from 'react-router-dom'
import { EditMode } from '../../src'
import { DataDrivenCatalog } from '../Catalog'
import { IResource } from '../common/resource'
import { clusterSetBindings, namespaces, placementRules, placements, policies } from '../common/test-data'
import { onSubmit } from '../common/utils'
import { RouteE } from '../Routes'
import { PolicySetWizard } from './PolicySetWizard'

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.PolicySet}`)
}

export function PolicySetExamples() {
    const history = useHistory()
    return (
        <DataDrivenCatalog
            title="Policy Set Wizard Examples"
            breadcrumbs={[{ label: 'Example Wizards', to: RouteE.Wizards }, { label: 'Policy Set Wizard Examples' }]}
            filterGroups={[
                {
                    id: 'placements',
                    label: 'Placement Types',
                    filters: [
                        { value: 'Placement' },
                        { value: 'Placement Binding' },
                        { value: 'Placement Rule' },
                        { value: 'Placement Rule Binding' },
                    ],
                },
            ]}
            cards={[
                {
                    title: 'Create policy set',
                    descriptions: ['Create a new policy set.'],
                    // featureGroups: [{ title: 'Features', features: ['Create a new policy set.'] }],
                    labels: ['Placement'],
                    onClick: () => history.push(RouteE.CreatePolicySet),
                },
                {
                    title: 'Edit policy set with single placement',
                    featureGroups: [{ title: 'Features', features: ['Single placement'] }],
                    labels: ['Placement', 'Placement Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet1),
                },
                {
                    title: 'Edit policy set with two placements',
                    featureGroups: [{ title: 'Features', features: ['Two placements'] }],
                    labels: ['Placement', 'Placement Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet2),
                },
                {
                    title: 'Edit policy set with single placement rule',
                    featureGroups: [{ title: 'Features', features: ['Single placement rule'] }],
                    labels: ['Placement Rule', 'Placement Rule Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet3),
                },
                {
                    title: 'Edit policy set with two placement rules',
                    featureGroups: [{ title: 'Features', features: ['Two placements rules'] }],
                    labels: ['Placement Rule', 'Placement Rule Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet4),
                },
                {
                    title: 'Edit policy set with both placement types',
                    featureGroups: [{ title: 'Features', features: ['Two placements', 'Two placement rules'] }],
                    labels: ['Placement', 'Placement Rule', 'Placement Binding', 'Placement Rule Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet5),
                },
                {
                    title: 'Edit policy set with placement binding',
                    featureGroups: [{ title: 'Features', features: ['Placement binding'] }],
                    labels: ['Placement Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet6),
                },
                {
                    title: 'Edit policy set with placement rule binding',
                    featureGroups: [{ title: 'Features', features: ['Placement rule binding'] }],
                    labels: ['Placement Rule Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet7),
                },
                {
                    title: 'Edit policy set with both placement bindings',
                    featureGroups: [{ title: 'Features', features: ['Placement binding', 'Placement rule binding'] }],
                    labels: ['Placement Binding', 'Placement Rule Binding'],
                    onClick: () => history.push(RouteE.EditPolicySet8),
                },
            ]}
        />
    )
}

export function CreatePolicySet() {
    const history = useHistory()
    return (
        <PolicySetWizard
            title="Create policy set"
            namespaces={namespaces}
            policies={policies}
            placements={placements}
            placementRules={placementRules}
            clusterSetBindings={clusterSetBindings}
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
        />
    )
}

export function EditPolicySet1() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithSinglePlacementResources}
        />
    )
}

export function EditPolicySet2() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithTwoPlacementResources}
        />
    )
}

export function EditPolicySet3() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithSinglePlacementRuleResources}
        />
    )
}

export function EditPolicySet4() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithTwoPlacementRuleResources}
        />
    )
}

export function EditPolicySet5() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithTwoPlacementAndTwoPlacementRuleResources}
        />
    )
}

export function EditPolicySet6() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithPlacementBindingResources}
        />
    )
}

export function EditPolicySet7() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithPlacementRuleBindingResources}
        />
    )
}

export function EditPolicySet8() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Edit policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            editMode={EditMode.Edit}
            resources={policySetWithBindingsResources}
        />
    )
}

const policySetResource: IResource = {
    apiVersion: 'policy.open-cluster-management.io/v1',
    kind: 'PolicySet',
    metadata: {
        name: 'my-policy-set',
        namespace: 'my-namespace-1',
    },
    spec: {
        description: 'Policy set with a single Placement and PlacementBinding.',
        policies: ['my-policy-1', 'my-policy-2'],
    },
} as IResource

const singlePlacementResources: IResource[] = [
    {
        apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
        kind: 'Placement',
        metadata: {
            name: 'my-policy-set-placement-1',
            namespace: 'my-namespace-1',
        },
        spec: {
            numberOfClusters: 1,
            clusterSets: ['my-cluster-set-1'],
            predicates: [
                {
                    requiredClusterSelector: {
                        labelSelector: {
                            matchLabels: {
                                'local-cluster': 'true',
                            },
                        },
                    },
                },
            ],
        },
    } as IResource,
    {
        apiVersion: 'policy.open-cluster-management.io/v1',
        kind: 'PlacementBinding',
        metadata: {
            name: 'my-policy-set-placement-1-binding',
            namespace: 'my-namespace-1',
        },
        placementRef: {
            name: 'my-policy-set-placement-1',
            kind: 'Placement',
            apiGroup: 'cluster.open-cluster-management.io',
        },
        subjects: [
            {
                name: 'my-policy-set',
                kind: 'PolicySet',
                apiGroup: 'policy.open-cluster-management.io',
            },
        ],
    } as IResource,
]

const policySetWithSinglePlacementResources: IResource[] = [policySetResource, ...singlePlacementResources]

const twoPlacementResources: IResource[] = [
    ...singlePlacementResources,
    {
        apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
        kind: 'Placement',
        metadata: {
            name: 'my-policy-set-placement-2',
            namespace: 'my-namespace-1',
        },
        spec: {
            numberOfClusters: 1,
            clusterSets: ['policy-test-cluster-set'],
            predicates: [
                {
                    requiredClusterSelector: {
                        labelSelector: {
                            matchLabels: {
                                'local-cluster': 'true',
                                abc: '123',
                                def: '456',
                                ghi: '789',
                            },
                            matchExpressions: [
                                {
                                    key: 'abc',
                                    operator: 'In',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'def',
                                    operator: 'NotIn',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'ghi',
                                    operator: 'Exists',
                                },
                                {
                                    key: 'jkl',
                                    operator: 'DoesNotExist',
                                },
                            ],
                        },
                        claimSelector: {
                            matchExpressions: [
                                {
                                    key: 'abc',
                                    operator: 'In',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'def',
                                    operator: 'NotIn',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'ghi',
                                    operator: 'Exists',
                                },
                                {
                                    key: 'jkl',
                                    operator: 'DoesNotExist',
                                },
                            ],
                        },
                    },
                },
                {
                    requiredClusterSelector: {
                        labelSelector: {
                            matchLabels: {
                                'local-cluster': 'true',
                                abc: '123',
                                def: '456',
                                ghi: '789',
                            },
                            matchExpressions: [
                                {
                                    key: 'abc',
                                    operator: 'In',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'def',
                                    operator: 'NotIn',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'ghi',
                                    operator: 'Exists',
                                },
                                {
                                    key: 'jkl',
                                    operator: 'DoesNotExist',
                                },
                            ],
                        },
                        claimSelector: {
                            matchExpressions: [
                                {
                                    key: 'abc',
                                    operator: 'In',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'def',
                                    operator: 'NotIn',
                                    values: ['123', '456', '789'],
                                },
                                {
                                    key: 'ghi',
                                    operator: 'Exists',
                                },
                                {
                                    key: 'jkl',
                                    operator: 'DoesNotExist',
                                },
                            ],
                        },
                    },
                },
            ],
        },
    } as IResource,
    {
        apiVersion: 'policy.open-cluster-management.io/v1',
        kind: 'PlacementBinding',
        metadata: {
            name: 'my-policy-set-placement-2-binding',
            namespace: 'my-namespace-1',
        },
        placementRef: {
            name: 'my-policy-set-placement-2',
            kind: 'Placement',
            apiGroup: 'cluster.open-cluster-management.io',
        },
        subjects: [
            {
                name: 'my-policy-set',
                kind: 'PolicySet',
                apiGroup: 'policy.open-cluster-management.io',
            },
        ],
    } as IResource,
]

const policySetWithTwoPlacementResources: IResource[] = [policySetResource, ...twoPlacementResources]

const singlePlacementRuleResources: IResource[] = [
    {
        apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
        kind: 'PlacementRule',
        metadata: {
            name: 'my-policy-set-placement-rule-1',
            namespace: 'my-namespace-1',
        },
        spec: {
            numberOfClusters: 1,
            clusterSets: ['my-cluster-set-1'],
            predicates: [
                {
                    requiredClusterSelector: {
                        labelSelector: {
                            matchLabels: {
                                'local-cluster': 'true',
                            },
                        },
                    },
                },
            ],
        },
    } as IResource,
    {
        apiVersion: 'policy.open-cluster-management.io/v1',
        kind: 'PlacementBinding',
        metadata: {
            name: 'my-policy-set-placement-rule-1-binding',
            namespace: 'my-namespace-1',
        },
        placementRef: {
            name: 'my-policy-set-placement-rule-1',
            kind: 'Placement',
            apiGroup: 'cluster.open-cluster-management.io',
        },
        subjects: [
            {
                name: 'my-policy-set',
                kind: 'PolicySet',
                apiGroup: 'policy.open-cluster-management.io',
            },
        ],
    } as IResource,
]

const policySetWithSinglePlacementRuleResources: IResource[] = [policySetResource, ...singlePlacementRuleResources]

const twoPlacementRuleResources: IResource[] = [
    ...policySetWithSinglePlacementRuleResources,
    {
        apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
        kind: 'PlacementRule',
        metadata: {
            name: 'my-policy-set-placement-rule-2',
            namespace: 'my-namespace-1',
        },
        spec: {
            numberOfClusters: 1,
            clusterSets: ['policy-test-cluster-set'],
            predicates: [
                {
                    requiredClusterSelector: {
                        labelSelector: {
                            matchLabels: {
                                'local-cluster': 'true',
                            },
                        },
                    },
                },
            ],
        },
    } as IResource,
    {
        apiVersion: 'policy.open-cluster-management.io/v1',
        kind: 'PlacementBinding',
        metadata: {
            name: 'my-policy-set-placement-rule-2-binding',
            namespace: 'my-namespace-1',
        },
        placementRef: {
            name: 'my-policy-set-placement-rule-2',
            kind: 'Placement',
            apiGroup: 'cluster.open-cluster-management.io',
        },
        subjects: [
            {
                name: 'my-policy-set',
                kind: 'PolicySet',
                apiGroup: 'policy.open-cluster-management.io',
            },
        ],
    } as IResource,
]

const policySetWithTwoPlacementRuleResources: IResource[] = [policySetResource, ...twoPlacementRuleResources]

const policySetWithTwoPlacementAndTwoPlacementRuleResources: IResource[] = [
    policySetResource,
    ...twoPlacementResources,
    ...twoPlacementRuleResources,
]

const placementBindingResource: IResource = {
    apiVersion: 'policy.open-cluster-management.io/v1',
    kind: 'PlacementBinding',
    metadata: {
        name: 'my-policy-set-placement-binding',
        namespace: 'my-namespace-1',
    },
    placementRef: {
        name: 'my-placement-1',
        kind: 'Placement',
        apiGroup: 'cluster.open-cluster-management.io',
    },
    subjects: [
        {
            name: 'my-policy-set',
            kind: 'PolicySet',
            apiGroup: 'policy.open-cluster-management.io',
        },
    ],
} as IResource

const placementRuleBindingResource: IResource = {
    apiVersion: 'policy.open-cluster-management.io/v1',
    kind: 'PlacementBinding',
    metadata: {
        name: 'my-policy-set-placement-rule-binding',
        namespace: 'my-namespace-1',
    },
    placementRef: {
        name: 'my-placement-rule-1',
        kind: 'PlacementRule',
        apiGroup: 'cluster.open-cluster-management.io',
    },
    subjects: [
        {
            name: 'my-policy-set',
            kind: 'PolicySet',
            apiGroup: 'policy.open-cluster-management.io',
        },
    ],
} as IResource

const policySetWithPlacementBindingResources: IResource[] = [policySetResource, placementBindingResource]
const policySetWithPlacementRuleBindingResources: IResource[] = [policySetResource, placementRuleBindingResource]
const policySetWithBindingsResources: IResource[] = [policySetResource, placementBindingResource, placementRuleBindingResource]
