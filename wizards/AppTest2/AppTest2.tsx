import { Split, Stack } from '@patternfly/react-core'
import {
    FormWizardArrayInput,
    FormWizardCheckbox,
    FormWizardKeyValue,
    FormWizardHidden,
    FormWizardPage as Wizard,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection as Section,
    FormWizardSelect,
    FormWizardSelector,
    FormWizardStep as Step,
    FormWizardTextDetail,
    FormWizardTextInput as TextInput,
    FormWizardTile,
    FormWizardTiles,
    FormWizardTimeRange,
} from '../../src'
import { Fragment, useMemo } from 'react'

export function DeploymentWindow() {
    return (
        <Section
            id="deploymentWindow.title"
            label="Deployment window"
            description="Schedule a time window for deployments"
            labelHelp="Define a time window if you want to activate or block resources deployment within a certain time interval."
        >
            <FormWizardRadioGroup
                id="remediation"
                path="deployment.window"
                required
                // hidden={get(resources, 'DELEM') === undefined}
            >
                <FormWizardRadio id="always" label="Always active" value="always" />
                <FormWizardRadio id="active" label="Active within specified interval" value="active">
                    <TimeWindow />
                </FormWizardRadio>
                <FormWizardRadio id="blocked" label="Blocked within specified interval" value="blocked">
                    <TimeWindow />
                </FormWizardRadio>
            </FormWizardRadioGroup>
        </Section>
    )
}

export function TimeWindow() {
    return (
        <Stack hasGutter style={{ paddingBottom: 16 }}>
            {/* TODO InputCheckBoxGroup */}
            {/* <FormWizardSection title="Deployment window"> */}
            <FormWizardCheckbox id="timeWindow.sunday" label="Sunday" />
            <FormWizardCheckbox id="timeWindow.monday" label="Monday" />
            <FormWizardCheckbox id="timeWindow.tuesday" label="Tuesday" />
            <FormWizardCheckbox id="timeWindow.wednesday" label="Wednesday" />
            <FormWizardCheckbox id="timeWindow.thursday" label="Thursday" />
            <FormWizardCheckbox id="timeWindow.friday" label="Friday" />
            <FormWizardCheckbox id="timeWindow.saturday" label="Saturday" />
            {/* </FormWizardSection> */}
            <FormWizardSelect id="timeWindow.timezone" label="Time zone" placeholder="Select the time zone" options={['EST']} required />
            <FormWizardArrayInput
                id="timeWindows"
                placeholder="Add time range"
                collapsedContent={
                    <Fragment>
                        <FormWizardTextDetail id="start" placeholder="Expand to enter the variable" />
                        <FormWizardHidden hidden={(item: ITimeRangeVariableData) => item.end === undefined}>
                            &nbsp;-&nbsp;
                            <FormWizardTextDetail id="end" />
                        </FormWizardHidden>
                    </Fragment>
                }
            >
                <Split hasGutter>
                    <FormWizardTimeRange id="start" label="Start Time"></FormWizardTimeRange>
                    <FormWizardTimeRange id="end" label="End Time"></FormWizardTimeRange>
                </Split>
            </FormWizardArrayInput>
        </Stack>
    )
}

interface ITimeRangeVariableData {
    start: string
    end: string
}

export function AppTest2() {
    const placements = useMemo(() => ['placement-1', 'placement-2'], [])
    function addSubscription() {
        return (
            <Fragment>
                <Step label="Respository Type">
                    <FormWizardTiles id="" label="Repository type">
                        <FormWizardTile
                            id="git"
                            path={null}
                            value="SubscriptionGit"
                            label="Git"
                            description="Use a Git repository"
                            newValue={{
                                apiVersion: 'apps.open-cluster-management.io/v1',
                                kind: 'Subscription',
                                metadata: {
                                    name: '',
                                    namespace: '',
                                    labels: { app: '' },
                                    annotations: {
                                        'apps.open-cluster-management.io/git-branch': '',
                                        'apps.open-cluster-management.io/git-path': '',
                                        'apps.open-cluster-management.io/reconcile-option': 'merge',
                                    },
                                },
                                spec: { channel: '', placement: { placementRef: { kind: 'Placement', name: '' } } },
                            }}
                        />
                        <FormWizardTile id="helm" value="SubscriptionHelm" label="Helm" description="Use a Helm repository" />
                        <FormWizardTile
                            id="objectstorage"
                            value="SubscriptionObjectstorage"
                            label="Object Storage"
                            description="Use a bucket from an object storage repository"
                        />
                    </FormWizardTiles>
                    <FormWizardHidden
                        hidden={(data) => {
                            const annotations = data[0]?.metadata?.annotations
                            if (annotations) {
                                if ('apps.open-cluster-management.io/git-branch' in annotations) {
                                    return false
                                }
                            }
                            return true
                        }}
                    >
                        <FormWizardSelect
                            id="subscription.git.url"
                            label="URL"
                            placeholder="Select a Git URL"
                            labelHelp="The URL path for the Git repository."
                            options={['TODO']}
                            required
                        />
                        <FormWizardArrayInput
                            id=""
                            placeholder="Add Channel"
                            collapsedContent="metadata.name"
                            collapsedPlaceholder="Expand to enter the placement details"
                            label="New Channel"
                            path={null}
                            filter={(item) => item.kind === 'Channel'}
                            newValue={{
                                apiVersion: 'apps.open-cluster-management.io/v1',
                                kind: 'Channel',
                                metadata: {
                                    annotations: { 'apps.open-cluster-management.io/reconcile-rate': '' },
                                    name: '',
                                    namespace: '',
                                },
                                spec: {
                                    type: 'Git',
                                    pathname: '',
                                },
                            }}
                        >
                            <TextInput id="text-input" path="metadata.name" label="Name" required />
                            <TextInput id="text-input" path="metadata.namespace" label="Namespace" required />
                            <FormWizardSelect
                                id="subscriptionNamespace"
                                label="Namespace"
                                path="metadata.namespace"
                                placeholder="Select the namespace"
                                options={['namespace1', 'namespace2']}
                                required
                            />
                            <TextInput id="text-input" path="spec.pathname" label="Url" required />
                            <FormWizardSelect
                                id="gitReconcileRate"
                                path={`metadata.annotations.apps\\.open-cluster-management\\.io/reconcile-rate`}
                                label="Repository reconcile rate"
                                options={['low', 'medium', 'high', 'off']}
                                required
                            />
                        </FormWizardArrayInput>
                        <TextInput
                            id="text-input"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/git-branch`}
                            label="Branch"
                            required
                        />
                    </FormWizardHidden>
                </Step>
                <Step label="Placement">
                    <Section
                        label="Placements"
                        prompt="Add placements"
                        description="Placements are used to place applications on clusters. Only new placements are shown here. Both new and existing placements can be selected when creating a subscription."
                    >
                        <FormWizardSelect id="placement" label="Placement" options={placements} path="spec.placement.placementRef.name" />
                        <FormWizardArrayInput
                            id=""
                            placeholder="Add"
                            collapsedContent="metadata.name"
                            collapsedPlaceholder="Expand to enter the placement details"
                            label="Placements"
                            path={null}
                            filter={(item) => item.kind === 'Placement'}
                            newValue={{
                                apiVersion: 'cluster.open-cluster-management.io/v1alpha1',
                                kind: 'Placement',
                                metadata: { name: '' },
                            }}
                        >
                            <TextInput id="text-input" path="metadata.name" label="Name" required />
                            <FormWizardKeyValue
                                id=""
                                path="spec.predicates.requiredClusterSelector.labelSelector.matchLabels"
                                label="Cluster labels"
                            ></FormWizardKeyValue>
                        </FormWizardArrayInput>
                    </Section>
                    <DeploymentWindow />
                </Step>
                <Step label="Settings"></Step>
            </Fragment>
        )
    }

    return (
        <Wizard title="Create application" defaultData={[]}>
            <Step label="Details">
                <Section label="Details" prompt="Enter the application details">
                    <FormWizardSelector selectKey="kind" selectValue="Subscription">
                        <TextInput id="text-input" path="metadata.labels.app" label="Name" required />
                        <FormWizardSelect
                            id="subscriptionNamespace"
                            label="Namespace"
                            path="metadata.namespace"
                            placeholder="Select the namespace"
                            options={['namespace1', 'namespace2']}
                            required
                        />
                    </FormWizardSelector>
                </Section>
            </Step>
            <Step label="Subscription-will deprecate">{addSubscription()}</Step>
            <Step label="Add subscription">
                <FormWizardArrayInput
                    id=""
                    placeholder="Add Subscription"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter the subscription details"
                    label="Subscription"
                    path={null}
                    filter={(item) => item.kind === 'Subscription'}
                    newValue={{
                        apiVersion: 'apps.open-cluster-management.io/v1',
                        kind: 'Subscription',
                        metadata: {
                            name: '',
                            namespace: '',
                            labels: { app: '' },
                            annotations: {
                                'apps.open-cluster-management.io/git-branch': '',
                                'apps.open-cluster-management.io/git-path': '',
                                'apps.open-cluster-management.io/reconcile-option': 'merge',
                            },
                        },
                        spec: { channel: '', placement: { placementRef: { kind: 'Placement', name: '' } } },
                    }}
                >
                    {addSubscription()}
                </FormWizardArrayInput>
            </Step>
        </Wizard>
    )
}
