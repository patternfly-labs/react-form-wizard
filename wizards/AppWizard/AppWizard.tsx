import {
    ArrayInput,
    ItemSelector,
    KeyValue,
    Section,
    Select,
    Step,
    TextInput as TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'
import { PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'

export function AppWizard(props: { onSubmit: WizardSubmit; onCancel: WizardCancel }) {
    return (
        <WizardPage
            title="Create application"
            defaultData={[
                { apiVersion: 'v1', kind: 'Namespace', metadata: { name: '' } },
                { apiVersion: 'app.k8s.io/v1beta1', kind: 'Application', metadata: { name: '', namespace: '' } },
            ]}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <Step label="Details" id="details">
                <Section label="Details" prompt="Enter the application details">
                    <ItemSelector selectKey="kind" selectValue="Application">
                        <TextInput id="text-input" path="metadata.name" label="Name" required />
                        <TextInput id="text-input" path="metadata.namespace" label="Namespace" required />
                    </ItemSelector>
                </Section>
            </Step>
            <Step label="Subscriptions" id="specifications">
                <Section
                    label="Subscriptions"
                    prompt="Add repository subscriptions"
                    description={'An application can be made up of multiple subscriptions. '}
                >
                    <ArrayInput
                        id=""
                        placeholder="Add subscription"
                        collapsedContent="metadata.name"
                        label="Subscriptions"
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
                                    'apps.open-cluster-management.io/git-desired-commit': '',
                                    'apps.open-cluster-management.io/git-tag': '',
                                    'apps.open-cluster-management.io/reconcile-option': 'merge',
                                },
                            },
                            spec: { channel: '', placement: { placementRef: { kind: PlacementRuleKind, name: '' } } },
                        }}
                        collapsedPlaceholder="Expand to enter the subscription details"
                    >
                        <TextInput id="text-input" path="metadata.name" label="Name" required />
                        <TextInput id="text-input" path="metadata.namespace" label="Namespace" required />
                        <Select
                            id="select"
                            path="spec.channel"
                            label="Channel"
                            options={[
                                { label: 'channel-1', value: 'channel-1-ns/channel-1' },
                                { label: 'channel-2', value: 'channel-2-ns/channel-2' },
                            ]}
                            helperText="A subscription targets a channel. The channel targets a source repository containing the application resources. Click on 'Channels' to add a new channel."
                        />
                        <TextInput
                            id="text-input"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/git-branch`}
                            label="Branch"
                        />
                        <TextInput
                            id="text-input"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/git-path`}
                            label="Path"
                        />
                        <TextInput
                            id="text-input"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/git-desired-commit`}
                            label="Commit hash"
                        />
                        <TextInput id="text-input" path={`metadata.annotations.apps\\.open-cluster-management\\.io/git-tag`} label="Tag" />
                        <Select
                            id="select"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/reconcile-option`}
                            label="Reconcile option"
                            options={['merge', 'replace']}
                            required
                        />
                    </ArrayInput>
                </Section>
            </Step>
            <Step label="Channels" id="channels">
                <Section
                    label="Channels"
                    prompt="Add channels"
                    description="A channel targets a source repository containing application resources."
                >
                    <ArrayInput
                        id=""
                        placeholder="Add channel"
                        collapsedContent="metadata.name"
                        collapsedPlaceholder="Expand to enter the channel details"
                        label="Channels"
                        path={null}
                        filter={(item) => item.kind === 'Channel'}
                        newValue={{
                            apiVersion: 'apps.open-cluster-management.io/v1',
                            kind: 'Channel',
                            metadata: {
                                name: '',
                                namespace: '',
                                annotations: {
                                    'apps.open-cluster-management.io/reconcile-rate': 'medium',
                                },
                            },
                            spec: {
                                type: '',
                            },
                        }}
                    >
                        <TextInput id="text-input" path="metadata.name" label="Channel name" required />
                        <Select
                            id="type"
                            path={`spec.type`}
                            label="Repository type"
                            options={['Git', 'HelmRepo', 'ObjectBucket']}
                            required
                        />
                        <TextInput id="pathname" path="spec.pathname" label="Repository URL" placeholder="Enter the URL" required />
                        <Select
                            id="type"
                            path="spec.secretRef.name"
                            label="Repository secret"
                            options={['TODO']}
                            helperText="The secret containing the credentials to access the repository."
                        />
                        <Select
                            id="select"
                            path={`metadata.annotations.apps\\.open-cluster-management\\.io/reconcile-rate`}
                            label="Repository reconcile rate"
                            options={['low', 'medium', 'high', 'off']}
                        />
                    </ArrayInput>
                </Section>
            </Step>
            <Step label="Placements" id="placements">
                <Section
                    label="Placements"
                    prompt="Add placements"
                    description="Placements are used to place applications on clusters. Only new placements are shown here. Both new and existing placements can be selected when creating a subscription."
                >
                    <ArrayInput
                        id=""
                        placeholder="Add"
                        collapsedContent="metadata.name"
                        collapsedPlaceholder="Expand to enter the placement details"
                        label="Placements"
                        path={null}
                        filter={(item) => item.kind === PlacementRuleKind}
                        newValue={{ ...PlacementRuleType, metadata: { name: '' } }}
                    >
                        <TextInput id="text-input" path="metadata.name" label="Name" required />
                        <KeyValue id="" path="spec.clusterSelector.matchLabels" label="Cluster labels"></KeyValue>
                    </ArrayInput>
                </Section>
            </Step>
            <Step label="Secrets" id="secret">
                <Section
                    label="Secrets"
                    prompt="Add secrets"
                    description="Some repositories need credentials stored as secrets to access the repository. Add any needed credential secrets here."
                >
                    <ArrayInput
                        id=""
                        placeholder="Add"
                        collapsedContent="metadata.name"
                        collapsedPlaceholder="Expand to enter the secret details"
                        label="Secrets"
                        path={null}
                        filter={(item) => item.kind === 'Secret'}
                        newValue={{
                            apiVersion: 'apps.open-cluster-management.io/v1',
                            kind: 'Secret',
                            metadata: { name: '' },
                        }}
                    >
                        <TextInput id="text-input" path="metadata.name" label="Name" required />
                        <TextInput id="" path="stringData.user" label="Username" secret />
                        <TextInput id="" path="stringData.accessToken" label="Access token" secret />
                        <TextInput
                            id=""
                            path="stringData.AccessKeyID"
                            label="Access key"
                            secret
                            helperText="The access key for accessing the object store."
                        />
                        <TextInput
                            id=""
                            path="stringData.SecretAccessKey"
                            label="Secret key"
                            secret
                            helperText="The secret key for accessing the object store."
                        />
                    </ArrayInput>
                </Section>
            </Step>
        </WizardPage>
    )
}
