import { Button, Flex, FlexItem, SelectOption, Split, Stack } from '@patternfly/react-core'
import { GitAltIcon, PlusIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useMemo } from 'react'
import {
    ArrayInput,
    Checkbox,
    Hidden,
    ItemSelector,
    Multiselect,
    Radio,
    RadioGroup,
    Section,
    Select,
    Step,
    TextDetail,
    TextInput,
    Tile,
    Tiles,
    TimeRange,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'
import { Sync } from '../common/Sync'
import { Placement } from '../Placement/PlacementSection'
import HelmIcon from './logos/HelmIcon.svg'

interface ArgoWizardProps {
    addClusterSets?: string
    ansibleCredentials: string[]
    argoServers: string[]
    namespaces: string[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    placements: string[]
    subscriptionGitChannels: { name: string; namespace: string; pathname: string }[]
    timeZones: string[]
}

export function ArgoWizard(props: ArgoWizardProps) {
    const requeueTimes = useMemo(() => [30, 60, 120, 180, 300], [])
    const urlOptions = useMemo(() => ['url1', 'url2'], [])

    return (
        <WizardPage
            title="Create application set"
            defaultData={[
                {
                    apiVersion: 'argoproj.io/v1alpha1',
                    kind: 'ApplicationSet',
                    metadata: {
                        name: '',
                        namespace: '',
                    },
                    spec: {
                        generators: [
                            {
                                clusterDecisionResource: {
                                    configMapRef: 'acm-placement',
                                    labelSelector: {
                                        matchLabels: {
                                            'cluster.open-cluster-management.io/placement': '-placement',
                                        },
                                    },
                                    requeueAfterSeconds: 180,
                                },
                            },
                        ],
                        template: {
                            metadata: {
                                name: '-{{name}}',
                            },
                            spec: {
                                project: 'default',
                                source: {},
                                destination: {
                                    namespace: '',
                                    server: '{{server}}',
                                },
                            },
                        },
                    },
                },
                {
                    apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                    kind: 'Placement',
                    metadata: { name: '', namespace: '' },
                    spec: {},
                },
            ]}
            onCancel={props.onCancel}
            onSubmit={props.onSubmit}
        >
            <Step id="general" label="General">
                <Sync
                    kind="Placement"
                    path="metadata.name"
                    targetPath="spec.generators.0.clusterDecisionResource.labelSelector.matchLabels.cluster\.open-cluster-management\.io/placement"
                />
                <Sync kind="ApplicationSet" path="metadata.name" prefix="-placement" />
                <Sync kind="ApplicationSet" path="metadata.namespace" />
                <Sync
                    kind="ApplicationSet"
                    path="metadata.name"
                    targetKind="ApplicationSet"
                    targetPath="spec.template.metadata.name"
                    postfix="-{{name}}"
                />
                <ItemSelector selectKey="kind" selectValue="ApplicationSet">
                    <Section label="General">
                        <TextInput path="metadata.name" label="ApplicationSet name" placeholder="Enter the application set name" required />
                        <Select
                            path="metadata.namespace"
                            label="Argo server"
                            placeholder="Select the Argo server"
                            labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                            options={props.argoServers}
                            required
                        />
                        <ExternalLinkButton id="addClusterSets" icon={<PlusIcon />} href={props.addClusterSets} />
                        <Select
                            path="spec.generators.0.clusterDecisionResource.requeueAfterSeconds"
                            label="Requeue time"
                            options={requeueTimes}
                            labelHelp="Cluster decision resource requeue time in seconds"
                            required
                        />
                    </Section>
                </ItemSelector>
            </Step>
            <Step id="template" label="Template">
                <ItemSelector selectKey="kind" selectValue="ApplicationSet">
                    <Section label="Source">
                        <Tiles path="repositoryType" label="Repository type">
                            <Tile id="git" value="Git" label="Git" icon={<GitAltIcon />} description="Use a Git repository" />
                            <Tile id="helm" value="Helm" label="Helm" icon={<HelmIcon />} description="Use a Helm repository" />
                        </Tiles>
                        {/* Git repo */}
                        <Hidden hidden={(data) => data.repositoryType !== 'Git'}>
                            <Select
                                path="spec.template.spec.source.repoURL"
                                label="URL"
                                labelHelp="The URL path for the Git repository."
                                placeholder="Enter or select a Git URL"
                                options={urlOptions}
                                required
                            />
                            <Select
                                path="spec.template.spec.source.targetRevision"
                                label="Revision"
                                labelHelp="Refer to a single commit"
                                placeholder="Enter or select a tracking revision"
                                options={urlOptions}
                            />
                            <Select
                                path="spec.template.spec.source.path"
                                label="Path"
                                labelHelp="The location of the resources on the Git repository."
                                placeholder="Enter or select a repository path"
                                options={urlOptions}
                            />
                        </Hidden>
                        {/* Helm repo */}
                        <Hidden hidden={(data) => data.repositoryType !== 'Helm'}>
                            <Select
                                path="spec.template.spec.source.repoURL"
                                label="URL"
                                labelHelp="The URL path for the Helm repository."
                                placeholder="Enter or select a Helm URL"
                                options={urlOptions}
                                required
                            />
                            <TextInput
                                path="spec.template.spec.source.chart"
                                label="Chart name"
                                placeholder="Enter the name of the Helm chart"
                                labelHelp="The specific name for the target Helm chart."
                                required
                            />
                            <TextInput
                                path="spec.template.spec.source.targetRevision"
                                label="Package version"
                                placeholder="Enter the version or versions"
                                labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                                required
                            />
                        </Hidden>
                    </Section>
                    <Section label="Destination">
                        <TextInput
                            path="spec.template.spec.destination.namespace"
                            label="Remote namespace"
                            placeholder="Enter the destination namespace"
                            required
                        />
                    </Section>
                </ItemSelector>
            </Step>
            <Step id="sync-policy" label="Sync policy">
                <ItemSelector selectKey="kind" selectValue="ApplicationSet">
                    <Section
                        label="Sync policy"
                        description="Settings used to configure application syncing when there are differences between the desired state and the live cluster state."
                    >
                        {/* Git only sync policies */}
                        <Hidden hidden={(data) => data.repositoryType !== 'Git'}>
                            <Checkbox
                                label="Delete resources that are no longer defined in Git"
                                path="spec.template.spec.syncPolicy.automated.prune"
                            />
                            <Checkbox
                                label="Delete resources that are no longer defined in Git at the end of a sync operation"
                                path="spec.template.spec.syncPolicy.syncOptions"
                                map={mapCheckbox('PruneLast')}
                                unmap={unmapCheckbox('PruneLast')}
                            />
                            <Checkbox
                                label="Replace resources instead of applying changes from Git"
                                path="spec.template.spec.syncPolicy.syncOptions"
                                map={mapCheckbox('Replace')}
                                unmap={unmapCheckbox('Replace')}
                            />
                        </Hidden>
                        <Checkbox
                            path="spec.template.spec.syncPolicy.automated.allowEmpty"
                            label="Allow applications to have empty resources"
                        />
                        <Checkbox
                            label="Only synchronize out-of-sync resources"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            map={mapCheckbox('ApplyOutOfSyncOnly')}
                            unmap={unmapCheckbox('ApplyOutOfSyncOnly')}
                        />
                        <Checkbox
                            path="spec.template.spec.syncPolicy.automated.selfHeal"
                            label="Automatically sync when cluster state changes"
                        />
                        <Checkbox
                            label="Automatically create namespace if it does not exist"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            map={mapCheckbox('CreateNamespace')}
                            unmap={unmapCheckbox('CreateNamespace')}
                        />
                        <Checkbox
                            label="Disable kubectl validation"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            map={mapCheckbox('Validate')}
                            unmap={unmapCheckbox('Validate')}
                        />
                        {/* PrunePropagationPolicy=background */}
                        {/* <Checkbox path="syncPolicy.prunePropagationPolicy" label="Prune propagation policy">
                            <Select
                                label="Propogation policy"
                                options={['foreground', 'background', 'orphan']}
                                path="spec.template.spec.syncPolicy.syncOptions"
                                // map={mapSelect('PrunePropagationPolicy')}
                                // unmap={mapSelect('PrunePropagationPolicy')}
                                required
                            />
                        </Checkbox> */}
                    </Section>
                </ItemSelector>
            </Step>
            <Step id="placement" label="Placement">
                <ItemSelector selectKey="kind" selectValue="Placement">
                    <Placement namespaceClusterSetNames={[]} />
                </ItemSelector>
            </Step>
        </WizardPage>
    )
}

export function DeploymentWindow(props: { timeZone: string[] }) {
    return (
        <Section
            hidden={(data) => {
                return data.deployType === 'ArgoCD'
            }}
            id="deploymentWindow.title"
            label="Deployment window"
            description="Schedule a time window for deployments"
            labelHelp="Define a time window if you want to activate or block resources deployment within a certain time interval."
        >
            <RadioGroup
                id="remediation"
                path="deployment.window"
                required
                // hidden={get(resources, 'DELEM') === undefined}
            >
                <Radio id="always" label="Always active" value="always" />
                <Radio id="active" label="Active within specified interval" value="active">
                    <TimeWindow timeZone={props.timeZone} />
                </Radio>
                <Radio id="blocked" label="Blocked within specified interval" value="blocked">
                    <TimeWindow timeZone={props.timeZone} />
                </Radio>
            </RadioGroup>
        </Section>
    )
}

export function TimeWindow(props: { timeZone: string[] }) {
    return (
        <Stack hasGutter style={{ paddingBottom: 16 }}>
            <Multiselect
                label="Time window configuration"
                placeholder="Select at least one day to create a time window."
                path="timewindow.daysofweek"
                required
            >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((value) => (
                    <SelectOption key={value} value={value} />
                ))}
            </Multiselect>
            <Select path="timeWindow.timezone" label="Time zone" placeholder="Select the time zone" options={props.timeZone} required />
            <ArrayInput
                path="timeWindows"
                placeholder="Add time range"
                collapsedContent={
                    <Fragment>
                        <TextDetail path="start" placeholder="Expand to enter the variable" />
                        <Hidden hidden={(item: ITimeRangeVariableData) => item.end === undefined}>
                            &nbsp;-&nbsp;
                            <TextDetail path="end" />
                        </Hidden>
                    </Fragment>
                }
            >
                <Split hasGutter>
                    <TimeRange path="start" label="Start Time"></TimeRange>
                    <TimeRange path="end" label="End Time"></TimeRange>
                </Split>
            </ArrayInput>
        </Stack>
    )
}

export function ExternalLinkButton(props: { id: string; href?: string; icon?: ReactNode }) {
    return (
        <Flex>
            <FlexItem spacer={{ default: 'spacerXl' }}>
                <Button id={props.id} icon={props.icon} isSmall={true} variant="link" component="a" href={props.href} target="_blank">
                    Add cluster sets
                </Button>
            </FlexItem>
        </Flex>
    )
}

interface ITimeRangeVariableData {
    start: string
    end: string
}

function mapCheckbox(key: string) {
    return function mapCheckboxValue(array: unknown, value: boolean | string) {
        let newArray: unknown[]
        if (Array.isArray(array)) {
            newArray = array
        } else {
            newArray = []
        }
        const index = newArray.findIndex((entry) => typeof entry === 'string' && entry.startsWith(`${key}=`))
        if (index !== -1) {
            newArray[index] = `${key}=${value.toString()}`
        } else {
            newArray.push(`${key}=${value.toString()}`)
        }
        return newArray
    }
}

function unmapCheckbox(key: string) {
    return function unmapCheckboxValue(array: unknown) {
        if (Array.isArray(array)) return array?.includes(`${key}=true`)
        return false
    }
}
