import { Fragment } from 'react'
import {
    ArrayInput as ArrayInput,
    KeyValue,
    Section,
    Select as Select,
    Step,
    TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'

export function AnsibleWizard(props: {
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    credentials: string[]
    namespaces: string[]
    data?: any
    breadcrumb?: { label: string; to?: string }[]
}) {
    return (
        <WizardPage
            title="Create Ansible automation"
            breadcrumb={props.breadcrumb}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            defaultData={
                props.data ?? {
                    apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                    kind: 'ClusterCurator',
                    metadata: {},
                }
            }
        >
            <Step label="Details" id="details">
                <Section
                    label="Details"
                    prompt="Configure the automation"
                    description="Automation is accomplished by creating a ClusterCurator resource which can be selected during cluster creation to automate running ansible jobs."
                >
                    <TextInput label="Name" id="name" path="metadata.name" required />
                    <Select
                        label="Namespace"
                        id="namespace"
                        path="metadata.namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={props.namespaces}
                        required
                    />
                </Section>
            </Step>

            <Step label="Install" id="install">
                <Section id="install" label="Install" prompt="Install Ansible job templates">
                    <Select
                        id="install-secret"
                        path="spec.install.towerAuthSecret"
                        label="Ansible credentials"
                        helperText="Ansible credentials for jobs run during cluster install."
                        options={props.credentials}
                        required
                    />

                    <ArrayInput
                        id="install-prehooks"
                        path="spec.install.prehook"
                        label="Pre-install jobs"
                        helperText="Ansible job templates run before cluster installation."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>

                    <ArrayInput
                        id="install-posthooks"
                        path="spec.install.posthook"
                        label="Post-install jobs"
                        helperText="Ansible job templates run after cluster installation."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>
                </Section>
            </Step>

            <Step label="Upgrade" id="upgrade">
                <Section id="upgrade" label="Upgrade" prompt="Upgrade Ansible job templates">
                    <Select
                        id="upgrade-secret"
                        path="spec.upgrade.towerAuthSecret"
                        label="Ansible credentials"
                        helperText="Ansible credentials jobs run during cluster upgrade."
                        options={props.credentials}
                        required
                    />
                    <ArrayInput
                        id="upgrade-prehooks"
                        path="spec.upgrade.prehook"
                        label="Pre-upgrade jobs"
                        helperText="Ansible job templates run before cluster upgrade."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>
                    <ArrayInput
                        id="upgrade-posthooks"
                        path="spec.upgrade.posthook"
                        label="Post-upgrade jobs"
                        helperText="Ansible job templates run after cluster upgrade."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>
                </Section>
            </Step>
        </WizardPage>
    )
}

function JobInputs() {
    return (
        <Fragment>
            <TextInput
                id="name"
                path="name"
                label="Ansible job template name"
                placeholder="Enter or select Ansible job template name"
                required
            />
            <KeyValue id="extra_vars" path="extra_vars" label="Extra variables" placeholder="Add variable" />
        </Fragment>
    )
}
