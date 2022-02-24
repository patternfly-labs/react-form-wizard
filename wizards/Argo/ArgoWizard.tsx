import { Button, Flex, FlexItem, SelectOption, Split, Stack, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'
import { GitAltIcon, PlusIcon } from '@patternfly/react-icons'
import { Fragment, ReactNode, useMemo, useState } from 'react'
import {
    ArrayInput,
    Checkbox,
    DetailsHidden,
    EditMode,
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
import { useData } from '../../src/contexts/DataContext'
import { useEditMode } from '../../src/contexts/EditModeContext'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { IPlacement, PlacementApiVersion, PlacementKind, PlacementType } from '../common/resources/IPlacement'
import { Sync } from '../common/Sync'
import { Placement } from '../Placement/Placement'
import HelmIcon from './logos/HelmIcon.svg'

interface Channel {
    metadata?: {
        name?: string
        namespace?: string
    }
    spec: {
        pathname: string
        type: string
        secretRef?: { name: string }
    }
}

interface ArgoWizardProps {
    addClusterSets?: string
    ansibleCredentials: string[]
    argoServers: string[]
    namespaces: string[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    placements: IPlacement[]
    channels?: Channel[]
    timeZones: string[]
    getGitRevisions: (
        channelPath: string,
        secretArgs?:
            | {
                  secretRef?: string | undefined
                  namespace?: string | undefined
              }
            | undefined
    ) => Promise<unknown>
    getGitPaths: (
        channelPath: string,
        branch: string,
        secretArgs?:
            | {
                  secretRef?: string | undefined
                  namespace?: string | undefined
              }
            | undefined
    ) => Promise<unknown>
}

export function ArgoWizard(props: ArgoWizardProps) {
    const requeueTimes = useMemo(() => [30, 60, 120, 180, 300], [])
    const gitChannels = useMemo(() => {
        if (props.channels)
            return props.channels
                .filter((channel) => channel?.spec?.type === 'Git' || channel?.spec?.type === 'GitHub')
                .map((channel) => channel?.spec?.pathname)
        return undefined
    }, [props.channels])
    const helmChannels = useMemo(() => {
        if (props.channels)
            return props.channels.filter((channel) => channel?.spec?.type === 'HelmRepo').map((channel) => channel.spec.pathname)
        return undefined
    }, [props.channels])

    const [gitPaths, setGitPaths] = useState<string[] | undefined>(undefined)
    const [gitRevisions, setGitRevisions] = useState<string[] | undefined>(undefined)
    return (
        <WizardPage
            title="Create application set"
            defaultData={[
                {
                    apiVersion: 'argoproj.io/v1alpha1',
                    kind: 'ApplicationSet',
                    metadata: { name: '', namespace: '' },
                    spec: {
                        generators: [
                            {
                                clusterDecisionResource: {
                                    configMapRef: 'acm-placement',
                                    labelSelector: { matchLabels: { 'cluster.open-cluster-management.io/placement': '-placement' } },
                                    requeueAfterSeconds: 180,
                                },
                            },
                        ],
                        template: {
                            metadata: { name: '-{{name}}' },
                            spec: { project: 'default', source: {}, destination: { namespace: '', server: '{{server}}' } },
                        },
                    },
                },
                {
                    ...PlacementType,
                    metadata: { name: '', namespace: '' },
                },
            ]}
            onCancel={props.onCancel}
            onSubmit={props.onSubmit}
        >
            <Step id="general" label="General">
                <Sync
                    kind={PlacementKind}
                    path="metadata.name"
                    targetKind="ApplicationSet"
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
                        <TextInput
                            path="metadata.name"
                            label="ApplicationSet name"
                            placeholder="Enter the application set name"
                            required
                            id="name"
                        />
                        <Select
                            id="namespace"
                            path="metadata.namespace"
                            label="Argo server"
                            placeholder="Select the Argo server"
                            labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                            options={props.argoServers}
                            required
                        />
                        <DetailsHidden>
                            <ExternalLinkButton id="addClusterSets" icon={<PlusIcon />} href={props.addClusterSets} />
                        </DetailsHidden>
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
                        <Tiles
                            path="spec.template.spec.source"
                            label="Repository type"
                            inputValueToPathValue={repositoryTypeToSource}
                            pathValueToInputValue={sourceToRepositoryType}
                        >
                            <Tile id="git" value="Git" label="Git" icon={<GitAltIcon />} description="Use a Git repository" />
                            <Tile id="helm" value="Helm" label="Helm" icon={<HelmIcon />} description="Use a Helm repository" />
                        </Tiles>
                        {/* Git repo */}
                        <Hidden hidden={(data) => data.spec.template.spec.source.path === undefined}>
                            <Select
                                path="spec.template.spec.source.repoURL"
                                label="URL"
                                labelHelp="The URL path for the Git repository."
                                placeholder="Enter or select a Git URL"
                                options={gitChannels}
                                onValueChange={(value) => {
                                    const channel = props.channels?.find((channel) => channel.spec.pathname === value)
                                    channel && getGitBranchList(channel, props.getGitRevisions, setGitRevisions)
                                }}
                                required
                            />
                            <Hidden hidden={(data) => data.spec.template.spec.source.repoURL === ''}>
                                <Select
                                    path="spec.template.spec.source.targetRevision"
                                    label="Revision"
                                    labelHelp="Refer to a single commit"
                                    placeholder="Enter or select a tracking revision"
                                    options={gitRevisions}
                                    onValueChange={(value, item) => {
                                        const channel = props.channels?.find(
                                            (channel) => channel?.spec?.pathname === item.spec.template.spec.source.repoURL
                                        )
                                        channel && getGitPathList(channel, value as string, props.getGitPaths, setGitPaths)
                                    }}
                                />
                                <Select
                                    path="spec.template.spec.source.path"
                                    label="Path"
                                    labelHelp="The location of the resources on the Git repository."
                                    placeholder="Enter or select a repository path"
                                    options={gitPaths}
                                />
                            </Hidden>
                        </Hidden>
                        {/* Helm repo */}
                        <Hidden hidden={(data) => data.spec.template.spec.source.chart === undefined}>
                            <Select
                                path="spec.template.spec.source.repoURL"
                                label="URL"
                                labelHelp="The URL path for the Helm repository."
                                placeholder="Enter or select a Helm URL"
                                options={helmChannels}
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
                            id="destination"
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
                        <Hidden hidden={(data) => data.spec.template.spec.source.path === undefined}>
                            <Checkbox
                                label="Delete resources that are no longer defined in Git"
                                path="spec.template.spec.syncPolicy.automated.prune"
                            />
                            <Checkbox
                                id="prune-last"
                                label="Delete resources that are no longer defined in Git at the end of a sync operation"
                                path="spec.template.spec.syncPolicy.syncOptions"
                                inputValueToPathValue={booleanToSyncOptions('PruneLast')}
                                pathValueToInputValue={syncOptionsToBoolean('PruneLast')}
                            />
                            <Checkbox
                                id="replace"
                                label="Replace resources instead of applying changes from Git"
                                path="spec.template.spec.syncPolicy.syncOptions"
                                inputValueToPathValue={booleanToSyncOptions('Replace')}
                                pathValueToInputValue={syncOptionsToBoolean('Replace')}
                            />
                        </Hidden>
                        <Checkbox
                            path="spec.template.spec.syncPolicy.automated.allowEmpty"
                            label="Allow applications to have empty resources"
                        />
                        <Checkbox
                            id="apply-out-of-sync-only"
                            label="Only synchronize out-of-sync resources"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            inputValueToPathValue={booleanToSyncOptions('ApplyOutOfSyncOnly')}
                            pathValueToInputValue={syncOptionsToBoolean('ApplyOutOfSyncOnly')}
                        />
                        <Checkbox
                            path="spec.template.spec.syncPolicy.automated.selfHeal"
                            label="Automatically sync when cluster state changes"
                        />
                        <Checkbox
                            id="create-namespace"
                            label="Automatically create namespace if it does not exist"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            inputValueToPathValue={booleanToSyncOptions('CreateNamespace')}
                            pathValueToInputValue={syncOptionsToBoolean('CreateNamespace')}
                        />
                        <Checkbox
                            id="validate"
                            label="Disable kubectl validation"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            inputValueToPathValue={booleanToSyncOptions('Validate')}
                            pathValueToInputValue={syncOptionsToBoolean('Validate')}
                        />
                        <Checkbox
                            id="propagation-policy"
                            label="Prune propagation policy"
                            path="spec.template.spec.syncPolicy.syncOptions"
                            inputValueToPathValue={checkboxPrunePropagationPolicyToSyncOptions}
                            pathValueToInputValue={checkboxSyncOptionsToPrunePropagationPolicy}
                        >
                            <Select
                                label="Propogation policy"
                                options={['foreground', 'background', 'orphan']}
                                path="spec.template.spec.syncPolicy.syncOptions"
                                inputValueToPathValue={prunePropagationPolicyToSyncOptions}
                                pathValueToInputValue={syncOptionsToPrunePropagationPolicy}
                                required
                            />
                        </Checkbox>
                    </Section>
                </ItemSelector>
            </Step>
            <Step id="placement" label="Cluster placement">
                <ArgoWizardPlacementSection placements={props.placements} />
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

async function getGitBranchList(
    channel: Channel,
    getGitBranches: (channelPath: string, secretArgs?: { secretRef?: string; namespace?: string } | undefined) => Promise<unknown>,
    setGitBranches: (branches: any) => void
) {
    await getGitBranches(channel.spec.pathname, {
        secretRef: channel.spec?.secretRef?.name,
        namespace: channel.metadata?.namespace,
    }).then((result) => {
        if (result) {
            setGitBranches(result)
        } else setGitBranches([])
    })
}

async function getGitPathList(
    channel: Channel,
    branch: string,
    getGitPaths: (channelPath: string, branch: string, secretArgs?: { secretRef?: string; namespace?: string }) => Promise<unknown>,
    setGitPaths: (paths: any) => void
) {
    await getGitPaths(channel?.spec?.pathname, branch, {
        secretRef: channel?.spec?.secretRef?.name,
        namespace: channel.metadata?.namespace,
    }).then((result) => {
        if (result) {
            setGitPaths(result)
        } else setGitPaths([])
    })
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

function repositoryTypeToSource(value: unknown) {
    if (value === 'Git') {
        return {
            repoURL: '',
            targetRevision: '',
            path: '',
        }
    }
    if (value === 'Helm') {
        return {
            repoURL: '',
            chart: '',
            targetRevision: '',
        }
    }
    return value
}

function sourceToRepositoryType(source: unknown) {
    if (typeof source === 'object' && source !== null) {
        const isGit = 'repoURL' in source && 'path' in source && 'targetRevision' in source
        if (isGit) return 'Git'

        const isHelm = 'repoURL' in source && 'chart' in source && 'targetRevision' in source
        if (isHelm) return 'Helm'
    }
    return undefined
}

function booleanToSyncOptions(key: string) {
    return (value: unknown, array: unknown) => {
        let newArray: unknown[]
        if (Array.isArray(array)) {
            newArray = array
        } else {
            newArray = []
        }
        const index = newArray.findIndex((entry) => typeof entry === 'string' && entry.startsWith(`${key}=`))
        if (typeof value === 'boolean') {
            if (index !== -1) {
                newArray[index] = `${key}=${value.toString()}`
            } else {
                newArray.push(`${key}=${value.toString()}`)
            }
        }
        return newArray
    }
}

function syncOptionsToBoolean(key: string) {
    return (array: unknown) => {
        if (Array.isArray(array)) return array?.includes(`${key}=true`)
        return false
    }
}

function checkboxPrunePropagationPolicyToSyncOptions(value: unknown, array: unknown) {
    let newArray: unknown[]
    if (Array.isArray(array)) {
        newArray = array
    } else {
        newArray = []
    }
    if (typeof value === 'boolean') {
        const index = newArray.findIndex((entry) => typeof entry === 'string' && entry.startsWith(`PrunePropagationPolicy=`))
        if (value === true) {
            if (index === -1) {
                newArray.push(`PrunePropagationPolicy=background`)
            }
        } else {
            if (index !== -1) {
                newArray.splice(index, 1)
            }
        }
    }
    return newArray
}

function checkboxSyncOptionsToPrunePropagationPolicy(array: unknown) {
    return (
        Array.isArray(array) &&
        array.find((entry) => typeof entry === 'string' && entry.startsWith(`PrunePropagationPolicy=`)) !== undefined
    )
}

function prunePropagationPolicyToSyncOptions(value: unknown, array: unknown) {
    let newArray: unknown[]
    if (Array.isArray(array)) {
        newArray = array
    } else {
        newArray = []
    }
    const index = newArray.findIndex((entry) => typeof entry === 'string' && entry.startsWith(`PrunePropagationPolicy=`))
    if (typeof value === 'string') {
        if (index !== -1) {
            newArray[index] = `PrunePropagationPolicy=${value}`
        } else {
            newArray.push(`PrunePropagationPolicy=${value}`)
        }
    }
    return newArray
}

function syncOptionsToPrunePropagationPolicy(array: unknown) {
    if (Array.isArray(array)) {
        const index = array.findIndex((entry) => typeof entry === 'string' && entry.startsWith(`PrunePropagationPolicy=`))
        if (index !== -1) {
            const value = array[index]
            if (typeof value === 'string') {
                return value.slice('PrunePropagationPolicy='.length)
            }
        }
    }

    return 'background'
}

function ArgoWizardPlacementSection(props: { placements: IPlacement[] }) {
    const resources = useItem() as IResource[]
    const editMode = useEditMode()
    const hasPlacement = resources.find((r) => r.kind === PlacementKind) !== undefined
    const applicationSet = resources.find((r) => r.kind === 'ApplicationSet')
    const placements = props.placements.filter((placement) => placement.metadata?.namespace === applicationSet?.metadata?.namespace)
    const { update } = useData()
    return (
        <Section label="Cluster placement">
            <DetailsHidden>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {editMode === EditMode.Create && (
                        <span className="pf-c-form__label pf-c-form__label-text">How do you want to select clusters?</span>
                    )}
                    <ToggleGroup>
                        <ToggleGroupItem
                            text="New placement"
                            isSelected={hasPlacement}
                            onClick={() => {
                                let newResources = [...resources]
                                newResources = resources.filter((resource) => resource.kind !== PlacementKind)
                                newResources.push({
                                    apiVersion: PlacementApiVersion,
                                    kind: PlacementKind,
                                    metadata: { name: '', namespace: '' },
                                } as IResource)
                                update(newResources)
                            }}
                        />
                        <ToggleGroupItem
                            text="Existing placement"
                            isSelected={!hasPlacement}
                            onClick={() => {
                                let newResources = [...resources]
                                newResources = resources.filter((resource) => resource.kind !== PlacementKind)
                                update(newResources)
                            }}
                        />
                    </ToggleGroup>
                </div>
            </DetailsHidden>
            {hasPlacement ? (
                <ItemSelector selectKey="kind" selectValue={PlacementKind}>
                    <Placement namespaceClusterSetNames={[]} />
                </ItemSelector>
            ) : (
                <ItemSelector selectKey="kind" selectValue="ApplicationSet">
                    <Select
                        path="spec.generators.0.clusterDecisionResource.labelSelector.matchLabels.cluster\.open-cluster-management\.io/placement"
                        label="Existing placement"
                        options={placements.map((placement) => placement.metadata?.name ?? '')}
                    ></Select>
                </ItemSelector>
            )}
        </Section>
    )
}
