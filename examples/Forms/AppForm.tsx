import { Stack, TimePicker } from '@patternfly/react-core'
import { GitAltIcon } from '@patternfly/react-icons'
// handlebars
import Handlebars from 'handlebars'
import { Fragment, useMemo } from 'react'
import {
    InputArray,
    InputCheckbox,
    InputHidden,
    InputLabels,
    InputPage,
    InputRadio,
    InputRadioGroup,
    InputSection,
    InputSelect,
    InputStep,
    InputText,
    InputTextDetail,
    InputTile,
    InputTiles,
} from '../../src'
import ApplicationHandlebars from './applicationTemplates/App.hbs'
import ArgoAppSetHandlebars from './applicationTemplates/argoApplicationSet/ArgoApplication.hbs'
import ArgoTemplateGit from './applicationTemplates/argoApplicationSet/templateArgoGit.hbs'
import ArgoTemplateHelm from './applicationTemplates/argoApplicationSet/templateArgoHelm.hbs'
import SubscriptionHandlebars from './applicationTemplates/subscription/Application.hbs'
import SubscriptionGitHandlebars from './applicationTemplates/subscription/templateSubscriptionGit.hbs'
import SubscriptionHelmHandlebars from './applicationTemplates/subscription/templateSubscriptionHelm.hbs'
import SubscriptionObjHandlebars from './applicationTemplates/subscription/templateSubscriptionObj.hbs'
import SubscriptionPlacementHandlebars from './applicationTemplates/subscription/templateSubscriptionPlacement.hbs'

export function AppForm() {
    Handlebars.registerPartial('templateSubscription', Handlebars.compile(SubscriptionHandlebars))
    Handlebars.registerPartial('templateSubscription', Handlebars.compile(SubscriptionHandlebars))
    Handlebars.registerPartial('templateSubscriptionGit', Handlebars.compile(SubscriptionGitHandlebars))
    Handlebars.registerPartial('templateSubscriptionHelm', Handlebars.compile(SubscriptionHelmHandlebars))
    Handlebars.registerPartial('templateSubscriptionObj', Handlebars.compile(SubscriptionObjHandlebars))
    Handlebars.registerPartial('templateSubscriptionPlacement', Handlebars.compile(SubscriptionPlacementHandlebars))
    Handlebars.registerPartial('templateArgoCD', Handlebars.compile(ArgoAppSetHandlebars))
    Handlebars.registerPartial('templateArgoGit', Handlebars.compile(ArgoTemplateGit))
    Handlebars.registerPartial('templateArgoHelm', Handlebars.compile(ArgoTemplateHelm))
    const namespaces = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    const reconcileOptions = useMemo(() => ['merge', 'replace'], [])
    const reconcileRates = useMemo(() => ['medium', 'low', 'high', 'off'], [])
    const servers = useMemo(() => ['default', 'server-1', 'server-2'], [])
    const requeueTimes = useMemo(() => [30, 60, 120, 180, 300], [])
    const urls = useMemo(() => ['url1', 'url2'], [])
    const urlOptions = useMemo(() => ['url1', 'url2'], [])
    const ansibleCredentials = useMemo(() => ['credential1', 'credential2'], [])
    return (
        <InputPage
            title="Create an application"
            template={ApplicationHandlebars}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Applications' }]}
        >
            <InputStep label="Type">
                <InputSection label="Type" prompt="Type">
                    <InputTiles id="deployType" label="Select the application management type to deploy this application into clusters.">
                        <InputTile id="subscription" value="Subscription" label="Subscription" />
                        <InputTile id="argoCD" value="ArgoCD" label="Argo CD ApplicationSet" />
                    </InputTiles>
                </InputSection>
            </InputStep>

            <InputStep label="Details" hidden={(item) => item.deployType !== 'Subscription'}>
                <InputSection label="Details" prompt="Enter the details of the application">
                    <InputText id="name" label="Application name" required />
                    <InputSelect
                        id="namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the application resources will be created."
                        options={namespaces}
                        required
                    />
                </InputSection>
            </InputStep>

            <InputStep label="Repositories" hidden={(item) => item.deployType !== 'Subscription'}>
                <InputSection label="Repositories" prompt="Enter the application repositories">
                    <InputArray
                        id="repositories"
                        placeholder="Add repository"
                        collapsedText={<InputTextDetail id="url" placeholder="Expand to enter the repository details" />}
                    >
                        <InputTiles id="repositoryType" label="Repository type">
                            <InputTile id="git" value="SubscriptionGit" label="Git" icon={<GitAltIcon />} />
                            <InputTile id="helm" value="SubscriptionHelm" label="Helm" />
                            <InputTile id="objectstorage" value="SubscriptionObjectstorage" label="Object Storage" />
                        </InputTiles>

                        <InputHidden hidden={(data) => data.repositoryType !== 'SubscriptionGit'}>
                            <InputSelect
                                id="subscription.git.url"
                                label="URL"
                                placeholder="Enter or select a Git URL"
                                labelHelp="The URL path for the Git repository."
                                options={urls}
                                required
                            />
                            <InputText id="subscription.git.username" label="Username" placeholder="Enter the Git user name" />
                            <InputText id="subscription.git.accessToken" label="Access token" placeholder="Enter the Git access token" />
                            <InputSelect
                                id="subscription.git.branch"
                                label="Branch"
                                placeholder="Enter or select a branch"
                                labelHelp="The branch of the Git repository."
                                options={urls}
                                required
                            />
                            <InputSelect
                                id="subscription.git.path"
                                label="Path"
                                placeholder="Enter or select a repository path"
                                labelHelp="The location of the resources on the Git repository."
                                options={urls}
                                required
                            />

                            <InputText id="subscription.git.commitHash" label="Commit hash" placeholder="Enter a specific commit hash" />

                            <InputText id="subscription.git.tag" label="Tag" placeholder="Enter a specific tag" />
                            <InputSelect
                                id="subscription.git.reconcileOption"
                                label="Reconcile option"
                                labelHelp="With the Merge option, new fields are added and existing fields are updated in the resource. Choose to merge if resources are updated after the initial deployment. If you choose to replace, the existing resource is replaced with the Git source."
                                options={reconcileOptions}
                            />
                            <InputSelect
                                id="subscription.git.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                            />
                            <InputCheckbox
                                id="subscription.git.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <InputCheckbox
                                id="subscription.git.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                            <InputSelect
                                id="subscription.git.ansibleSecretName"
                                label="Ansible Automation Platform credential"
                                labelHelp="If using Configure automation for prehook and posthook tasks, select the Ansible Automation Platform credential. Click the Add credentials tab to create a new secret."
                                options={ansibleCredentials}
                            />
                        </InputHidden>

                        <InputHidden hidden={(data) => data.repositoryType !== 'SubscriptionHelm'}>
                            <InputSelect
                                id="subscription.helm.url"
                                label="URL"
                                placeholder="Enter or select a Helm repository URL"
                                labelHelp="The URL path for the Helm repository."
                                options={urls}
                                required
                            />
                            <InputText id="subscription.helm.username" label="Username" placeholder="Enter the Helm repository username" />
                            <InputText id="subscription.helm.password" label="Password" placeholder="Enter the Helm repository password" />
                            <InputText
                                id="subscription.helm.chart"
                                label="Chart name"
                                placeholder="Enter the name of the target Helm chart"
                                required
                            />
                            <InputText
                                id="subscription.helm.packageAlias"
                                label="Package alias"
                                placeholder="Enter the alias name of the target Helm chart"
                                labelHelp="The alias name for the target Helm chart."
                                required
                            />
                            <InputText
                                id="subscription.helm.packageVersion"
                                label="Package version"
                                placeholder="Enter the version or versions"
                                labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            />
                            <InputSelect
                                id="subscription.helm.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                                required
                            />
                            <InputCheckbox
                                id="subscription.helm.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <InputCheckbox
                                id="subscription.helm.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                        </InputHidden>

                        <InputHidden hidden={(data) => data.repositoryType !== 'SubscriptionObjectstorage'}>
                            <InputSelect
                                id="subscription.obj.url"
                                label="URL"
                                placeholder="Enter or select an ObjectStore bucket URL"
                                labelHelp="The URL path for the object store."
                                options={urls}
                                required
                            />
                            <InputText id="subscription.obj.accessKey" label="Access key" placeholder="Enter the object store access key" />
                            <InputText id="subscription.obj.secretKey" label="Secret key" placeholder="Enter the object store secret key" />
                            <InputText id="subscription.obj.region" label="Region" placeholder="Enter the AWS region of the S3 bucket" />
                            <InputText
                                id="subscription.obj.subfolder"
                                label="Subfolder"
                                placeholder="Enter the Amazon S3 or MinIO subfolder bucket path"
                            />
                        </InputHidden>

                        <InputHidden hidden={(data) => data.repositoryType === undefined}>
                            <PlacementRules />
                        </InputHidden>
                    </InputArray>
                </InputSection>
            </InputStep>

            <InputStep label="General" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <InputSection label="General">
                    <InputText id="appSetName" label="ApplicationSet name" placeholder="Enter the application set name" required />
                    <InputSelect
                        id="argoServer"
                        label="Argo server"
                        placeholder="Select the Argo server"
                        labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                        options={servers}
                        required
                    />
                    <InputSelect
                        id="requeueTime"
                        label="Requeue time"
                        options={requeueTimes}
                        labelHelp="Cluster decision resource requeue time in seconds"
                        required
                    />
                </InputSection>
            </InputStep>
            <InputStep label="Template" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <InputSection label="Source">
                    <InputTiles id="repositoryType" label="Repository type">
                        <InputTile id="git" value="Git" label="Git" icon={<GitAltIcon />} />
                        <InputTile id="helm" value="Helm" label="Helm" />
                    </InputTiles>
                    {/* Git repo */}
                    <InputHidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <InputSelect
                            id="git.url"
                            label="URL"
                            labelHelp="The URL path for the Git repository."
                            placeholder="Enter or select a Git URL"
                            options={urlOptions}
                            required
                        />
                        <InputSelect
                            id="git.revision"
                            label="Revision"
                            labelHelp="Refer to a single commit"
                            placeholder="Enter or select a tracking revision"
                            options={urlOptions}
                        />
                        <InputSelect
                            id="git.path"
                            label="Path"
                            labelHelp="The location of the resources on the Git repository."
                            placeholder="Enter or select a repository path"
                            options={urlOptions}
                        />
                    </InputHidden>
                    {/* Helm repo */}
                    <InputHidden hidden={(data) => data.repositoryType !== 'Helm'}>
                        <InputSelect
                            id="helm.url"
                            label="URL"
                            labelHelp="The URL path for the Helm repository."
                            placeholder="Enter or select a Helm URL"
                            options={urlOptions}
                            required
                        />
                        <InputText
                            id="helm.chart"
                            label="Chart name"
                            placeholder="Enter the name of the Helm chart"
                            labelHelp="The specific name for the target Helm chart."
                            required
                        />
                        <InputText
                            id="helm.packageVersion"
                            label="Package version"
                            placeholder="Enter the version or versions"
                            labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            required
                        />
                    </InputHidden>
                </InputSection>
                <InputSection label="Destination">
                    <InputText id="remoteNamespace" label="Remote namespace" placeholder="Enter the destination namespace" required />
                </InputSection>
            </InputStep>

            <InputStep label="Sync policy" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <InputSection
                    label="Sync policy"
                    description="Settings used to configure application syncing when there are differences between the desired state and the live cluster state."
                >
                    {/* Git only sync policies */}
                    <InputHidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <InputCheckbox path="syncPolicy.prune" label="Delete resources that are no longer defined in Git" />
                        <InputCheckbox
                            path="syncPolicy.pruneLast"
                            label="Delete resources that are no longer defined in Git at the end of a sync operation"
                        />
                        <InputCheckbox path="syncPolicy.replace" label="Replace resources instead of applying changes from Git" />
                    </InputHidden>
                    <InputCheckbox path="syncPolicy.allowEmpty" label="Allow applications to have empty resources" />
                    <InputCheckbox path="syncPolicy.applyOutOfSyncOnly" label="Only synchronize out-of-sync resources" />
                    <InputCheckbox path="syncPolicy.selfHeal" label="Automatically sync when cluster state changes" />
                    <InputCheckbox path="syncPolicy.createNamespace" label="Automatically create namespace if it does not exist" />
                    <InputCheckbox path="syncPolicy.validate" label="Disable kubectl validation" />
                    <InputCheckbox path="syncPolicy.prunePropagationPolicy" label="Prune propagation policy">
                        <InputSelect
                            id="syncPolicy.propagationPolicy"
                            label="Propogation policy"
                            options={['foreground', 'background', 'orphan']}
                            required
                        />
                    </InputCheckbox>
                </InputSection>
            </InputStep>

            <InputStep label="Placement" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <PlacementRules />
            </InputStep>
        </InputPage>
    )
}

export function PlacementRules() {
    return (
        <Fragment>
            <InputSection label="Cluster placement" description="Applications are deployed to clusters based on placements">
                <InputCheckbox id="placement.useLabels" label="New placement">
                    <InputLabels
                        id="placement.labels"
                        label="Cluster labels"
                        placeholder="Enter cluster labels"
                        helperText="Placement will only select clusters matching all the specified labels"
                        required
                    />
                </InputCheckbox>
                <InputCheckbox id="placement.useExisting" label="Use an existing placement">
                    <InputSelect
                        id="placement.select"
                        label="Placement"
                        placeholder="Select an existing placement"
                        options={['my-placement-rule-1']}
                        required
                    />
                </InputCheckbox>
            </InputSection>

            <InputSection label="Deployment window" description="Schedule a time window for deployments">
                <InputRadioGroup
                    id="remediation"
                    path="deployment.window"
                    required
                    // hidden={get(resources, 'DELEM') === undefined}
                >
                    <InputRadio id="always" label="Always active" value="always" />
                    <InputRadio id="active" label="Active within specified interval" value="active">
                        <TimeWindow />
                    </InputRadio>
                    <InputRadio id="blocked" label="Blocked within specified interval" value="blocked">
                        <TimeWindow />
                    </InputRadio>
                </InputRadioGroup>
            </InputSection>
        </Fragment>
    )
}

export function TimeWindow() {
    const onChange = (time, hour, minute, isValid) => {
        // TBD
        console.log('time', time)
        console.log('hour', hour)
        console.log('minute', minute)
        console.log('isValid', isValid)
    }
    return (
        <Stack hasGutter style={{ paddingBottom: 16 }}>
            {/* TODO InputCheckBoxGroup */}
            {/* <InputSection title="Deployment window"> */}
            <InputCheckbox id="timeWindow.sunday" label="Sunday" />
            <InputCheckbox id="timeWindow.monday" label="Monday" />
            <InputCheckbox id="timeWindow.tuesday" label="Tuesday" />
            <InputCheckbox id="timeWindow.wednesday" label="Wednesday" />
            <InputCheckbox id="timeWindow.thursday" label="Thursday" />
            <InputCheckbox id="timeWindow.friday" label="Friday" />
            <InputCheckbox id="timeWindow.saturday" label="Saturday" />
            {/* </InputSection> */}
            <InputSelect id="timeWindow.timezone" label="Time zone" placeholder="Select the time zone" options={['EST']} required />
            <InputArray
                id="timeWindows"
                placeholder="Add time range"
                collapsedText={<InputTextDetail id="timeWindowSection" placeholder="Expand to enter the time range" />}
            >
                <div className="config-time-container" style={{ display: 'flex', marginBottom: 20 }}>
                    <div className="config-input-time" style={{ float: 'left', marginRight: 10 }}>
                        <TimePicker id="startTime" onChange={onChange} width={'140px'} />
                        <TimePicker id="endTime" onChange={onChange} width={'140px'} />
                    </div>
                </div>
            </InputArray>
        </Stack>
    )
}
