import { Split, SplitItem } from '@patternfly/react-core'
import { CheckIcon } from '@patternfly/react-icons'
import { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { EditMode } from '../../src'
import { IResource } from '../common/resource'
import { onSubmit } from '../common/utils'
import { DashboardCard, DashboardPage } from '../Dashboard'
import { IClusterSetBinding } from '../Placement/PlacementSection'
import { RouteE } from '../Routes'
import { PolicySetWizard } from './PolicySetWizard'

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.PolicySet}`)
}

const namespaces = ['default', 'my-namespace-1', 'my-namespace-2']

const policies: IResource[] = [
    { kind: 'Policy', metadata: { name: 'my-policy-1', namespace: 'my-namespace-1' } },
    { kind: 'Policy', metadata: { name: 'my-policy-2', namespace: 'my-namespace-1' } },
    { kind: 'Policy', metadata: { name: 'my-policy-3', namespace: 'my-namespace-2' } },
    { kind: 'Policy', metadata: { name: 'my-policy-4', namespace: 'my-namespace-2' } },
]

const clusterSetBindings: IClusterSetBinding[] = [
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

const placements: IResource[] = [
    { kind: 'Placement', metadata: { name: 'my-placement-1', namespace: 'my-namespace-1' } },
    { kind: 'Placement', metadata: { name: 'my-placement-2', namespace: 'my-namespace-1' } },
    { kind: 'Placement', metadata: { name: 'my-placement-3', namespace: 'my-namespace-2' } },
    { kind: 'Placement', metadata: { name: 'my-placement-4', namespace: 'my-namespace-2' } },
]

const placementRules: IResource[] = [
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-1', namespace: 'my-namespace-1' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-2', namespace: 'my-namespace-1' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-3', namespace: 'my-namespace-2' } },
    { kind: 'PlacementRule', metadata: { name: 'my-placement-rule-4', namespace: 'my-namespace-2' } },
]

function Checked(props: { children: ReactNode }) {
    return (
        <Split hasGutter>
            <SplitItem>
                <CheckIcon color="green" />
            </SplitItem>
            <SplitItem>{props.children}</SplitItem>
        </Split>
    )
}
export function PolicySetExamples() {
    return (
        <DashboardPage title="Policy set examples">
            <DashboardCard title="Create policy set" route={RouteE.CreatePolicySet}>
                <Checked>Create a new policy set.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 1" route={RouteE.EditPolicySet1}>
                <Checked>Single placement.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 2" route={RouteE.EditPolicySet2}>
                <Checked>Two placements.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 3" route={RouteE.EditPolicySet3}>
                <Checked>Single placement rule.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 4" route={RouteE.EditPolicySet4}>
                <Checked>Two placement rules.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 5" route={RouteE.EditPolicySet5}>
                <Checked>Two placements.</Checked>
                <Checked>Two placement rules.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 6" route={RouteE.EditPolicySet6}>
                <Checked>Placement binding.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 7" route={RouteE.EditPolicySet7}>
                <Checked>Placement rule binding.</Checked>
            </DashboardCard>
            <DashboardCard title="Edit policy set 8" route={RouteE.EditPolicySet8}>
                <Checked>Placement binding.</Checked>
                <Checked>Placement rule binding.</Checked>
            </DashboardCard>
        </DashboardPage>
    )
}

export function CreatePolicySet() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={namespaces}
            policies={policies}
            clusterSetBindings={clusterSetBindings}
            placements={placements}
            placementRules={placementRules}
            title="Create policy set"
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

const policySetWithTwoPlacementResources: IResource[] = [...policySetWithSinglePlacementResources, ...twoPlacementResources]

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

const policySetWithTwoPlacementRuleResources: IResource[] = [...policySetWithSinglePlacementRuleResources, ...twoPlacementRuleResources]

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
