import { Fragment } from 'react'
import {
    FormSubmit,
    FormWizardArrayInput as ArrayInput,
    FormWizardKeyValue as KeyValue,
    FormWizardPage as Wizard,
    FormWizardSection as Section,
    FormWizardSelect as Select,
    FormWizardStep as Step,
    FormWizardTextInput as TextInput,
} from '../../src'

export function AnsibleWizard(props: { onSubmit?: FormSubmit; credentials: string[]; namespaces: string[] }) {
    return (
        <Wizard
            title="Create Ansible automation template"
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Automation' }]}
            onSubmit={props.onSubmit}
            defaultData={{
                apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                kind: 'ClusterCurator',
            }}
        >
            <Step label="Details">
                <Section label="Details" prompt="Configure the automation template">
                    <TextInput id="name" path="metadata.name" label="Name" required />
                    <Select
                        id="namespace"
                        path="metadata.namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={props.namespaces}
                        required
                    />
                </Section>
            </Step>

            <Step label="Install">
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
                        description="Ansible job templates run before cluster installation."
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
                        description="Ansible job templates run after cluster installation."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>
                </Section>
            </Step>

            <Step label="Upgrade">
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
                        description="Ansible job templates run before cluster upgrade."
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
                        description="Ansible job templates run after cluster upgrade."
                        placeholder="Add job template"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter the Ansible job template"
                        sortable
                    >
                        <JobInputs />
                    </ArrayInput>
                </Section>
            </Step>
        </Wizard>
    )
}

function JobInputs() {
    return (
        <Fragment>
            <TextInput id="name" label="Ansible job template name" placeholder="Enter or select Ansible job template name" required />
            <KeyValue id="extra_vars" label="Extra variables" placeholder="Add variable" />
        </Fragment>
    )
}
