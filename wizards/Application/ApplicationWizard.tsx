import { Split, Stack } from '@patternfly/react-core'
import { GitAltIcon } from '@patternfly/react-icons'
import Handlebars from 'handlebars'
import { Fragment, useMemo } from 'react'
import {
    FormCancel,
    ArrayInput,
    Checkbox,
    Hidden,
    FormWizardPage,
    Radio,
    RadioGroup,
    FormWizardSection,
    Select,
    FormWizardStep,
    TextDetail,
    Tile,
    TimeRange,
    LabelsInput,
    TextInput,
    Tiles,
} from '../../src'
import ApplicationHandlebars from './applicationTemplates/App.hbs'
import ArgoAppSetHandlebars from './applicationTemplates/argoApplicationSet/ArgoApplication.hbs'
import ArgoTemplateGit from './applicationTemplates/argoApplicationSet/templateArgoGit.hbs'
import ArgoTemplateHelm from './applicationTemplates/argoApplicationSet/templateArgoHelm.hbs'
import ArgoTemplatePlacement from './applicationTemplates/argoApplicationSet/templateArgoPlacement.hbs'
import SubscriptionHandlebars from './applicationTemplates/subscription/Application.hbs'
import SubscriptionGitHandlebars from './applicationTemplates/subscription/templateSubscriptionGit.hbs'
import SubscriptionHelmHandlebars from './applicationTemplates/subscription/templateSubscriptionHelm.hbs'
import SubscriptionObjHandlebars from './applicationTemplates/subscription/templateSubscriptionObj.hbs'
import SubscriptionPlacementHandlebars from './applicationTemplates/subscription/templateSubscriptionPlacement.hbs'
import ArgoIcon from './logos/ArgoIcon.svg'
import HelmIcon from './logos/HelmIcon.svg'
import ObjectStore from './logos/ObjectStore.svg'
import SubscriptionIcon from './logos/SubscriptionIcon.svg'

export function ApplicationWizard(props: {
    ansibleCredentials: string[]
    argoServers: string[]
    namespaces: string[]
    onCancel?: FormCancel
    placements: string[]
}) {
    Handlebars.registerPartial('templateSubscription', Handlebars.compile(SubscriptionHandlebars))
    Handlebars.registerPartial('templateSubscription', Handlebars.compile(SubscriptionHandlebars))
    Handlebars.registerPartial('templateSubscriptionGit', Handlebars.compile(SubscriptionGitHandlebars))
    Handlebars.registerPartial('templateSubscriptionHelm', Handlebars.compile(SubscriptionHelmHandlebars))
    Handlebars.registerPartial('templateSubscriptionObj', Handlebars.compile(SubscriptionObjHandlebars))
    Handlebars.registerPartial('templateSubscriptionPlacement', Handlebars.compile(SubscriptionPlacementHandlebars))
    Handlebars.registerPartial('templateArgoCD', Handlebars.compile(ArgoAppSetHandlebars))
    Handlebars.registerPartial('templateArgoGit', Handlebars.compile(ArgoTemplateGit))
    Handlebars.registerPartial('templateArgoHelm', Handlebars.compile(ArgoTemplateHelm))
    Handlebars.registerPartial('templateArgoPlacement', Handlebars.compile(ArgoTemplatePlacement))
    const reconcileOptions = useMemo(() => ['merge', 'replace'], [])
    const reconcileRates = useMemo(() => ['medium', 'low', 'high', 'off'], [])
    const requeueTimes = useMemo(() => [30, 60, 120, 180, 300], [])
    const urls = useMemo(() => ['url1', 'url2'], [])
    const urlOptions = useMemo(() => ['url1', 'url2'], [])
    return (
        <FormWizardPage
            title="Create application"
            template={ApplicationHandlebars}
            defaultData={{ curlyServer: '{{server}}', curlyName: '{{name}}' }}
            onCancel={props.onCancel}
        >
            <FormWizardStep label="Type">
                <FormWizardSection label="Type" prompt="Type">
                    <Tiles id="deployType" label="Select the application management type to deploy this application into clusters.">
                        <Tile
                            id="subscription"
                            value="Subscription"
                            label="Subscription"
                            icon={<SubscriptionIcon />}
                            description="Subscriptions are Kubernetes resources within channels (source repositories)"
                        />
                        <Tile
                            id="argoCD"
                            value="ArgoCD"
                            label="Argo CD ApplicationSet"
                            icon={<ArgoIcon />}
                            description="Supports deployments to large numbers of clusters, deployments of large monorepos, and enabling secure Application self-service."
                        />
                    </Tiles>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Details" hidden={(item) => item.deployType !== 'Subscription'}>
                <FormWizardSection label="Details" prompt="Enter the details of the application">
                    <TextInput id="name" label="Application name" required />
                    <Select
                        id="namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the application resources will be created."
                        options={props.namespaces}
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Repositories" hidden={(item) => item.deployType !== 'Subscription'}>
                <FormWizardSection label="Repositories" prompt="Enter the application repositories">
                    <ArrayInput
                        id="repositories"
                        placeholder="Add repository"
                        collapsedContent={<TextDetail id="url" placeholder="Expand to enter the repository details" />}
                    >
                        <Tiles id="repositoryType" label="Repository type">
                            <Tile id="git" value="SubscriptionGit" label="Git" icon={<GitAltIcon />} description="Use a Git repository" />
                            <Tile id="helm" value="SubscriptionHelm" label="Helm" icon={<HelmIcon />} description="Use a Helm repository" />
                            <Tile
                                id="objectstorage"
                                value="SubscriptionObjectstorage"
                                icon={<ObjectStore />}
                                label="Object Storage"
                                description="Use a bucket from an object storage repository"
                            />
                        </Tiles>

                        <Hidden hidden={(data) => data.repositoryType !== 'SubscriptionGit'}>
                            <Select
                                id="subscription.git.url"
                                label="URL"
                                placeholder="Enter or select a Git URL"
                                labelHelp="The URL path for the Git repository."
                                options={urls}
                                required
                            />
                            <TextInput
                                id="subscription.git.username"
                                label="Username"
                                placeholder="Enter the Git user name"
                                labelHelp="The username if this is a private Git repository and requires connection."
                            />
                            <TextInput
                                id="subscription.git.accessToken"
                                label="Access token"
                                placeholder="Enter the Git access token"
                                labelHelp="The access token if this is a private Git repository and requires connection."
                            />
                            <Select
                                id="subscription.git.branch"
                                label="Branch"
                                placeholder="Enter or select a branch"
                                labelHelp="The branch of the Git repository."
                                options={urls}
                                required
                            />
                            <Select
                                id="subscription.git.path"
                                label="Path"
                                placeholder="Enter or select a repository path"
                                labelHelp="The location of the resources on the Git repository."
                                options={urls}
                                required
                            />

                            <TextInput
                                id="subscription.git.commitHash"
                                label="Commit hash"
                                placeholder="Enter a specific commit hash"
                                labelHelp="If you want to subscribe to a specific commit, you need to specify the desired commit hash. You might need to specify git-clone-depth annotation if your desired commit is older than the last 20 commits."
                            />

                            <TextInput
                                id="subscription.git.tag"
                                label="Tag"
                                placeholder="Enter a specific tag"
                                labelHelp="If you want to subscribe to a specific tag, you need to specify the tag. If both Git desired commit and tag annotations are specified, the tag is ignored. You might need to specify git-clone-depth annotation if your desired commit of the tag is older than the last 20 commits."
                            />
                            <Select
                                id="subscription.git.reconcileOption"
                                label="Reconcile option"
                                labelHelp="With the Merge option, new fields are added and existing fields are updated in the resource. Choose to merge if resources are updated after the initial deployment. If you choose to replace, the existing resource is replaced with the Git source."
                                options={reconcileOptions}
                            />
                            <Select
                                id="subscription.git.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                            />
                            <Checkbox
                                id="subscription.git.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <Checkbox
                                id="subscription.git.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                            <Select
                                id="subscription.git.ansibleSecretName"
                                label="Ansible Automation Platform credential"
                                labelHelp="If using Configure automation for prehook and posthook tasks, select the Ansible Automation Platform credential. Click the Add credentials tab to create a new secret."
                                options={props.ansibleCredentials}
                            />
                        </Hidden>

                        <Hidden hidden={(data) => data.repositoryType !== 'SubscriptionHelm'}>
                            <Select
                                id="subscription.helm.url"
                                label="URL"
                                placeholder="Enter or select a Helm repository URL"
                                labelHelp="The URL path for the Helm repository."
                                options={urls}
                                required
                            />
                            <TextInput
                                id="subscription.helm.username"
                                label="Username"
                                placeholder="Enter the Helm repository username"
                                labelHelp="The username if this is a private Helm repository and requires connection."
                            />
                            <TextInput
                                id="subscription.helm.password"
                                label="Password"
                                placeholder="Enter the Helm repository password"
                                labelHelp="The password if this is a private Helm repository and requires connection."
                            />
                            <TextInput
                                id="subscription.helm.chart"
                                label="Chart name"
                                placeholder="Enter the name of the target Helm chart"
                                labelHelp="The specific name for the target Helm chart."
                                required
                            />
                            <TextInput
                                id="subscription.helm.packageAlias"
                                label="Package alias"
                                placeholder="Enter the alias name of the target Helm chart"
                                labelHelp="The alias name for the target Helm chart."
                                required
                            />
                            <TextInput
                                id="subscription.helm.packageVersion"
                                label="Package version"
                                placeholder="Enter the version or versions"
                                labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            />
                            <Select
                                id="subscription.helm.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                                required
                            />
                            <Checkbox
                                id="subscription.helm.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <Checkbox
                                id="subscription.helm.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                        </Hidden>

                        <Hidden hidden={(data) => data.repositoryType !== 'SubscriptionObjectstorage'}>
                            <Select
                                id="subscription.obj.url"
                                label="URL"
                                placeholder="Enter or select an ObjectStore bucket URL"
                                labelHelp="The URL path for the object store."
                                options={urls}
                                required
                            />
                            <TextInput
                                id="subscription.obj.accessKey"
                                label="Access key"
                                placeholder="Enter the object store access key"
                                labelHelp="The access key for accessing the object store."
                            />
                            <TextInput
                                id="subscription.obj.secretKey"
                                label="Secret key"
                                placeholder="Enter the object store secret key"
                                labelHelp="The secret key for accessing the object store."
                            />
                            <TextInput
                                id="subscription.obj.region"
                                label="Region"
                                placeholder="Enter the AWS region of the S3 bucket"
                                labelHelp="The AWS Region of the S3 bucket. This field is required for Amazon S3 buckets only."
                            />
                            <TextInput
                                id="subscription.obj.subfolder"
                                label="Subfolder"
                                placeholder="Enter the Amazon S3 or MinIO subfolder bucket path"
                                labelHelp="The Amazon S3 or MinIO subfolder bucket path. This field is optional for Amazon S3 and MinIO only."
                            />
                        </Hidden>

                        <Hidden hidden={(data) => data.repositoryType === undefined}>
                            <Placement placement={props.placements} />
                        </Hidden>
                    </ArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="General" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <FormWizardSection label="General">
                    <TextInput id="appSetName" label="ApplicationSet name" placeholder="Enter the application set name" required />
                    <Select
                        id="argoServer"
                        label="Argo server"
                        placeholder="Select the Argo server"
                        labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                        options={props.argoServers}
                        required
                    />
                    <Select
                        id="requeueTime"
                        label="Requeue time"
                        options={requeueTimes}
                        labelHelp="Cluster decision resource requeue time in seconds"
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>
            <FormWizardStep label="Template" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <FormWizardSection label="Source">
                    <Tiles id="repositoryType" label="Repository type">
                        <Tile id="git" value="Git" label="Git" icon={<GitAltIcon />} description="Use a Git repository" />
                        <Tile id="helm" value="Helm" label="Helm" icon={<HelmIcon />} description="Use a Helm repository" />
                    </Tiles>
                    {/* Git repo */}
                    <Hidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <Select
                            id="git.url"
                            label="URL"
                            labelHelp="The URL path for the Git repository."
                            placeholder="Enter or select a Git URL"
                            options={urlOptions}
                            required
                        />
                        <Select
                            id="git.revision"
                            label="Revision"
                            labelHelp="Refer to a single commit"
                            placeholder="Enter or select a tracking revision"
                            options={urlOptions}
                        />
                        <Select
                            id="git.path"
                            label="Path"
                            labelHelp="The location of the resources on the Git repository."
                            placeholder="Enter or select a repository path"
                            options={urlOptions}
                        />
                    </Hidden>
                    {/* Helm repo */}
                    <Hidden hidden={(data) => data.repositoryType !== 'Helm'}>
                        <Select
                            id="helm.url"
                            label="URL"
                            labelHelp="The URL path for the Helm repository."
                            placeholder="Enter or select a Helm URL"
                            options={urlOptions}
                            required
                        />
                        <TextInput
                            id="helm.chart"
                            label="Chart name"
                            placeholder="Enter the name of the Helm chart"
                            labelHelp="The specific name for the target Helm chart."
                            required
                        />
                        <TextInput
                            id="helm.packageVersion"
                            label="Package version"
                            placeholder="Enter the version or versions"
                            labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            required
                        />
                    </Hidden>
                </FormWizardSection>
                <FormWizardSection label="Destination">
                    <TextInput id="remoteNamespace" label="Remote namespace" placeholder="Enter the destination namespace" required />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Sync policy" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <FormWizardSection
                    label="Sync policy"
                    description="Settings used to configure application syncing when there are differences between the desired state and the live cluster state."
                >
                    {/* Git only sync policies */}
                    <Hidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <Checkbox id="syncPolicy.prune" label="Delete resources that are no longer defined in Git" />
                        <Checkbox
                            id="syncPolicy.pruneLast"
                            label="Delete resources that are no longer defined in Git at the end of a sync operation"
                        />
                        <Checkbox id="syncPolicy.replace" label="Replace resources instead of applying changes from Git" />
                    </Hidden>
                    <Checkbox id="syncPolicy.allowEmpty" label="Allow applications to have empty resources" />
                    <Checkbox id="syncPolicy.applyOutOfSyncOnly" label="Only synchronize out-of-sync resources" />
                    <Checkbox id="syncPolicy.selfHeal" label="Automatically sync when cluster state changes" />
                    <Checkbox id="syncPolicy.createNamespace" label="Automatically create namespace if it does not exist" />
                    <Checkbox id="syncPolicy.validate" label="Disable kubectl validation" />
                    <Checkbox id="syncPolicy.prunePropagationPolicy" label="Prune propagation policy">
                        <Select
                            id="syncPolicy.propagationPolicy"
                            label="Propogation policy"
                            options={['foreground', 'background', 'orphan']}
                            required
                        />
                    </Checkbox>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Placement" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <Placement placement={props.placements} />
            </FormWizardStep>
        </FormWizardPage>
    )
}

export function Placement(props: { placement: string[] }) {
    const labelOptions = useMemo(() => [{ id: 'amazon', label: 'cloud', value: 'Amazon' }], [])
    return (
        <Fragment>
            <FormWizardSection label="Cluster placement" description="Applications are deployed to clusters based on placements">
                <Checkbox
                    id="placement.useLabels"
                    label="New placement"
                    labelHelp="Deploy application resources only on clusters matching specified labels"
                >
                    <LabelsInput
                        id="placement.labels"
                        label="Cluster labels"
                        placeholder="Enter cluster labels"
                        helperText="Placement will only select clusters matching all the specified labels"
                        required
                        options={labelOptions}
                    />
                </Checkbox>
                <Checkbox
                    id="placement.useExisting"
                    label="Use an existing placement"
                    labelHelp="If available in the application namespace, you can select a predefined placement configuration"
                >
                    <Select
                        id="placement.select"
                        label="Placement"
                        placeholder="Select an existing placement"
                        options={props.placement}
                        required
                    />
                </Checkbox>
            </FormWizardSection>
            <DeploymentWindow />
        </Fragment>
    )
}

export function DeploymentWindow() {
    return (
        <FormWizardSection
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
                    <TimeWindow />
                </Radio>
                <Radio id="blocked" label="Blocked within specified interval" value="blocked">
                    <TimeWindow />
                </Radio>
            </RadioGroup>
        </FormWizardSection>
    )
}

export function TimeWindow() {
    return (
        <Stack hasGutter style={{ paddingBottom: 16 }}>
            {/* TODO InputCheckBoxGroup */}
            {/* <FormWizardSection title="Deployment window"> */}
            <Checkbox id="timeWindow.sunday" label="Sunday" />
            <Checkbox id="timeWindow.monday" label="Monday" />
            <Checkbox id="timeWindow.tuesday" label="Tuesday" />
            <Checkbox id="timeWindow.wednesday" label="Wednesday" />
            <Checkbox id="timeWindow.thursday" label="Thursday" />
            <Checkbox id="timeWindow.friday" label="Friday" />
            <Checkbox id="timeWindow.saturday" label="Saturday" />
            {/* </FormWizardSection> */}
            <Select id="timeWindow.timezone" label="Time zone" placeholder="Select the time zone" options={['EST']} required />
            <ArrayInput
                id="timeWindows"
                placeholder="Add time range"
                collapsedContent={
                    <Fragment>
                        <TextDetail id="start" placeholder="Expand to enter the variable" />
                        <Hidden hidden={(item: ITimeRangeVariableData) => item.end === undefined}>
                            &nbsp;-&nbsp;
                            <TextDetail id="end" />
                        </Hidden>
                    </Fragment>
                }
            >
                <Split hasGutter>
                    <TimeRange id="start" label="Start Time"></TimeRange>
                    <TimeRange id="end" label="End Time"></TimeRange>
                </Split>
            </ArrayInput>
        </Stack>
    )
}

interface ITimeRangeVariableData {
    start: string
    end: string
}
