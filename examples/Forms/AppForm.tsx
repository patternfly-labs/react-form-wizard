import { Stack, TimePicker } from '@patternfly/react-core'
import { GitAltIcon } from '@patternfly/react-icons'
// handlebars
import Handlebars from 'handlebars'
import { Fragment, useMemo } from 'react'
import {
    FormWizardArrayInput,
    FormWizardCheckbox,
    FormWizardHidden,
    FormWizardLabels,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
    FormWizardTile,
    FormWizardTiles,
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
        <FormWizardPage
            title="Create an application"
            template={ApplicationHandlebars}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Applications' }]}
        >
            <FormWizardStep label="Type">
                <FormWizardSection label="Type" prompt="Type">
                    <FormWizardTiles
                        id="deployType"
                        label="Select the application management type to deploy this application into clusters."
                    >
                        <FormWizardTile id="subscription" value="Subscription" label="Subscription" />
                        <FormWizardTile id="argoCD" value="ArgoCD" label="Argo CD ApplicationSet" />
                    </FormWizardTiles>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Details" hidden={(item) => item.deployType !== 'Subscription'}>
                <FormWizardSection label="Details" prompt="Enter the details of the application">
                    <FormWizardTextInput id="name" label="Application name" required />
                    <FormWizardSelect
                        id="namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the application resources will be created."
                        options={namespaces}
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Repositories" hidden={(item) => item.deployType !== 'Subscription'}>
                <FormWizardSection label="Repositories" prompt="Enter the application repositories">
                    <FormWizardArrayInput
                        id="repositories"
                        placeholder="Add repository"
                        collapsedText={<FormWizardTextDetail id="url" placeholder="Expand to enter the repository details" />}
                    >
                        <FormWizardTiles id="repositoryType" label="Repository type">
                            <FormWizardTile id="git" value="SubscriptionGit" label="Git" icon={<GitAltIcon />} />
                            <FormWizardTile id="helm" value="SubscriptionHelm" label="Helm" />
                            <FormWizardTile id="objectstorage" value="SubscriptionObjectstorage" label="Object Storage" />
                        </FormWizardTiles>

                        <FormWizardHidden hidden={(data) => data.repositoryType !== 'SubscriptionGit'}>
                            <FormWizardSelect
                                id="subscription.git.url"
                                label="URL"
                                placeholder="Enter or select a Git URL"
                                labelHelp="The URL path for the Git repository."
                                options={urls}
                                required
                            />
                            <FormWizardTextInput id="subscription.git.username" label="Username" placeholder="Enter the Git user name" />
                            <FormWizardTextInput
                                id="subscription.git.accessToken"
                                label="Access token"
                                placeholder="Enter the Git access token"
                            />
                            <FormWizardSelect
                                id="subscription.git.branch"
                                label="Branch"
                                placeholder="Enter or select a branch"
                                labelHelp="The branch of the Git repository."
                                options={urls}
                                required
                            />
                            <FormWizardSelect
                                id="subscription.git.path"
                                label="Path"
                                placeholder="Enter or select a repository path"
                                labelHelp="The location of the resources on the Git repository."
                                options={urls}
                                required
                            />

                            <FormWizardTextInput
                                id="subscription.git.commitHash"
                                label="Commit hash"
                                placeholder="Enter a specific commit hash"
                            />

                            <FormWizardTextInput id="subscription.git.tag" label="Tag" placeholder="Enter a specific tag" />
                            <FormWizardSelect
                                id="subscription.git.reconcileOption"
                                label="Reconcile option"
                                labelHelp="With the Merge option, new fields are added and existing fields are updated in the resource. Choose to merge if resources are updated after the initial deployment. If you choose to replace, the existing resource is replaced with the Git source."
                                options={reconcileOptions}
                            />
                            <FormWizardSelect
                                id="subscription.git.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                            />
                            <FormWizardCheckbox
                                id="subscription.git.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <FormWizardCheckbox
                                id="subscription.git.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                            <FormWizardSelect
                                id="subscription.git.ansibleSecretName"
                                label="Ansible Automation Platform credential"
                                labelHelp="If using Configure automation for prehook and posthook tasks, select the Ansible Automation Platform credential. Click the Add credentials tab to create a new secret."
                                options={ansibleCredentials}
                            />
                        </FormWizardHidden>

                        <FormWizardHidden hidden={(data) => data.repositoryType !== 'SubscriptionHelm'}>
                            <FormWizardSelect
                                id="subscription.helm.url"
                                label="URL"
                                placeholder="Enter or select a Helm repository URL"
                                labelHelp="The URL path for the Helm repository."
                                options={urls}
                                required
                            />
                            <FormWizardTextInput
                                id="subscription.helm.username"
                                label="Username"
                                placeholder="Enter the Helm repository username"
                            />
                            <FormWizardTextInput
                                id="subscription.helm.password"
                                label="Password"
                                placeholder="Enter the Helm repository password"
                            />
                            <FormWizardTextInput
                                id="subscription.helm.chart"
                                label="Chart name"
                                placeholder="Enter the name of the target Helm chart"
                                required
                            />
                            <FormWizardTextInput
                                id="subscription.helm.packageAlias"
                                label="Package alias"
                                placeholder="Enter the alias name of the target Helm chart"
                                labelHelp="The alias name for the target Helm chart."
                                required
                            />
                            <FormWizardTextInput
                                id="subscription.helm.packageVersion"
                                label="Package version"
                                placeholder="Enter the version or versions"
                                labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            />
                            <FormWizardSelect
                                id="subscription.helm.reconcileRate"
                                label="Repository reconcile rate"
                                labelHelp="The frequency of resource reconciliation that is used as a global repository setting. The medium default setting checks for changes to apply every three minutes and re-applies all resources every 15 minutes, even without a change. Select low to reconcile every hour. Select high to reconcile every two minutes. If you select off, the deployed resources are not automatically reconciled."
                                options={reconcileRates}
                                required
                            />
                            <FormWizardCheckbox
                                id="subscription.helm.subReconcileRate"
                                label="Disable auto-reconciliation"
                                labelHelp="Turn the auto-reconciliation off for this specific application regardless of the reconcile rate setting in the repository."
                            />
                            <FormWizardCheckbox
                                id="subscription.helm.insecureSkipVerify"
                                label="Disable server certificate verification"
                                labelHelp="Disable server TLS certificate verification for Git server connection."
                            />
                        </FormWizardHidden>

                        <FormWizardHidden hidden={(data) => data.repositoryType !== 'SubscriptionObjectstorage'}>
                            <FormWizardSelect
                                id="subscription.obj.url"
                                label="URL"
                                placeholder="Enter or select an ObjectStore bucket URL"
                                labelHelp="The URL path for the object store."
                                options={urls}
                                required
                            />
                            <FormWizardTextInput
                                id="subscription.obj.accessKey"
                                label="Access key"
                                placeholder="Enter the object store access key"
                            />
                            <FormWizardTextInput
                                id="subscription.obj.secretKey"
                                label="Secret key"
                                placeholder="Enter the object store secret key"
                            />
                            <FormWizardTextInput
                                id="subscription.obj.region"
                                label="Region"
                                placeholder="Enter the AWS region of the S3 bucket"
                            />
                            <FormWizardTextInput
                                id="subscription.obj.subfolder"
                                label="Subfolder"
                                placeholder="Enter the Amazon S3 or MinIO subfolder bucket path"
                            />
                        </FormWizardHidden>

                        <FormWizardHidden hidden={(data) => data.repositoryType === undefined}>
                            <PlacementRules />
                        </FormWizardHidden>
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="General" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <FormWizardSection label="General">
                    <FormWizardTextInput
                        id="appSetName"
                        label="ApplicationSet name"
                        placeholder="Enter the application set name"
                        required
                    />
                    <FormWizardSelect
                        id="argoServer"
                        label="Argo server"
                        placeholder="Select the Argo server"
                        labelHelp="Argo server to deploy Argo app set. Click the Add cluster sets tab to create a new cluster set."
                        options={servers}
                        required
                    />
                    <FormWizardSelect
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
                    <FormWizardTiles id="repositoryType" label="Repository type">
                        <FormWizardTile id="git" value="Git" label="Git" icon={<GitAltIcon />} />
                        <FormWizardTile id="helm" value="Helm" label="Helm" />
                    </FormWizardTiles>
                    {/* Git repo */}
                    <FormWizardHidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <FormWizardSelect
                            id="git.url"
                            label="URL"
                            labelHelp="The URL path for the Git repository."
                            placeholder="Enter or select a Git URL"
                            options={urlOptions}
                            required
                        />
                        <FormWizardSelect
                            id="git.revision"
                            label="Revision"
                            labelHelp="Refer to a single commit"
                            placeholder="Enter or select a tracking revision"
                            options={urlOptions}
                        />
                        <FormWizardSelect
                            id="git.path"
                            label="Path"
                            labelHelp="The location of the resources on the Git repository."
                            placeholder="Enter or select a repository path"
                            options={urlOptions}
                        />
                    </FormWizardHidden>
                    {/* Helm repo */}
                    <FormWizardHidden hidden={(data) => data.repositoryType !== 'Helm'}>
                        <FormWizardSelect
                            id="helm.url"
                            label="URL"
                            labelHelp="The URL path for the Helm repository."
                            placeholder="Enter or select a Helm URL"
                            options={urlOptions}
                            required
                        />
                        <FormWizardTextInput
                            id="helm.chart"
                            label="Chart name"
                            placeholder="Enter the name of the Helm chart"
                            labelHelp="The specific name for the target Helm chart."
                            required
                        />
                        <FormWizardTextInput
                            id="helm.packageVersion"
                            label="Package version"
                            placeholder="Enter the version or versions"
                            labelHelp="The version or versions for the deployable. You can use a range of versions in the form >1.0, or <3.0."
                            required
                        />
                    </FormWizardHidden>
                </FormWizardSection>
                <FormWizardSection label="Destination">
                    <FormWizardTextInput
                        id="remoteNamespace"
                        label="Remote namespace"
                        placeholder="Enter the destination namespace"
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Sync policy" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <FormWizardSection
                    label="Sync policy"
                    description="Settings used to configure application syncing when there are differences between the desired state and the live cluster state."
                >
                    {/* Git only sync policies */}
                    <FormWizardHidden hidden={(data) => data.repositoryType !== 'Git'}>
                        <FormWizardCheckbox path="syncPolicy.prune" label="Delete resources that are no longer defined in Git" />
                        <FormWizardCheckbox
                            path="syncPolicy.pruneLast"
                            label="Delete resources that are no longer defined in Git at the end of a sync operation"
                        />
                        <FormWizardCheckbox path="syncPolicy.replace" label="Replace resources instead of applying changes from Git" />
                    </FormWizardHidden>
                    <FormWizardCheckbox path="syncPolicy.allowEmpty" label="Allow applications to have empty resources" />
                    <FormWizardCheckbox path="syncPolicy.applyOutOfSyncOnly" label="Only synchronize out-of-sync resources" />
                    <FormWizardCheckbox path="syncPolicy.selfHeal" label="Automatically sync when cluster state changes" />
                    <FormWizardCheckbox path="syncPolicy.createNamespace" label="Automatically create namespace if it does not exist" />
                    <FormWizardCheckbox path="syncPolicy.validate" label="Disable kubectl validation" />
                    <FormWizardCheckbox path="syncPolicy.prunePropagationPolicy" label="Prune propagation policy">
                        <FormWizardSelect
                            id="syncPolicy.propagationPolicy"
                            label="Propogation policy"
                            options={['foreground', 'background', 'orphan']}
                            required
                        />
                    </FormWizardCheckbox>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Placement" hidden={(item) => item.deployType !== 'ArgoCD'}>
                <PlacementRules />
            </FormWizardStep>
        </FormWizardPage>
    )
}

export function PlacementRules() {
    return (
        <Fragment>
            <FormWizardSection label="Cluster placement" description="Applications are deployed to clusters based on placements">
                <FormWizardCheckbox id="placement.useLabels" label="New placement">
                    <FormWizardLabels
                        id="placement.labels"
                        label="Cluster labels"
                        placeholder="Enter cluster labels"
                        helperText="Placement will only select clusters matching all the specified labels"
                        required
                    />
                </FormWizardCheckbox>
                <FormWizardCheckbox id="placement.useExisting" label="Use an existing placement">
                    <FormWizardSelect
                        id="placement.select"
                        label="Placement"
                        placeholder="Select an existing placement"
                        options={['my-placement-rule-1']}
                        required
                    />
                </FormWizardCheckbox>
            </FormWizardSection>

            <FormWizardSection label="Deployment window" description="Schedule a time window for deployments">
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
            </FormWizardSection>
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
                collapsedText={<FormWizardTextDetail id="timeWindowSection" placeholder="Expand to enter the time range" />}
            >
                <div className="config-time-container" style={{ display: 'flex', marginBottom: 20 }}>
                    <div className="config-input-time" style={{ float: 'left', marginRight: 10 }}>
                        <TimePicker id="startTime" onChange={onChange} width={'140px'} />
                        <TimePicker id="endTime" onChange={onChange} width={'140px'} />
                    </div>
                </div>
            </FormWizardArrayInput>
        </Stack>
    )
}
