import { Fragment } from 'react'
import {
    FormSubmit,
    FormWizardArrayInput,
    FormWizardKeyValue,
    FormWizardPage,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'

export function AnsibleWizard(props: { onSubmit?: FormSubmit; credentials: string[] }) {
    return (
        <FormWizardPage
            title="Create Ansible automation template"
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Automation' }]}
            onSubmit={props.onSubmit}
            defaultData={{
                apiVersion: 'cluster.open-cluster-management.io/v1beta1',
                kind: 'ClusterCurator',
            }}
        >
            <FormWizardStep label="Details">
                <FormWizardSection label="Details" prompt="Configure the automation template">
                    <FormWizardTextInput id="name" path="metadata.name" label="Name" required />
                    <FormWizardSelect
                        id="namespace"
                        path="metadata.namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Install">
                <FormWizardSection id="install" label="Install" prompt="Install Ansible job templates">
                    <FormWizardSelect
                        id="spec.install.towerAuthSecret"
                        label="Ansible credentials"
                        helperText="Ansible credentials for jobs run during cluster install."
                        options={props.credentials}
                        required
                    />

                    <FormWizardArrayInput
                        id="install-prehooks"
                        path="spec.install.prehook"
                        label="Pre-install jobs"
                        description="Ansible job templates run before cluster installation."
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>

                    <FormWizardArrayInput
                        id="install-posthooks"
                        path="spec.install.posthook"
                        label="Post-install jobs"
                        description="Ansible job templates run after cluster installation."
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Upgrade">
                <FormWizardSection id="install" label="Upgrade" prompt="Upgrade Ansible job templates">
                    <FormWizardSelect
                        id="spec.upgrade.towerAuthSecret"
                        label="Ansible credentials"
                        helperText="Ansible credentials jobs run during cluster upgrade."
                        options={props.credentials}
                        required
                    />
                    <FormWizardArrayInput
                        id="upgrade-prehooks"
                        path="spec.upgrade.prehook"
                        label="Pre-upgrade jobs"
                        description="Ansible job templates run before cluster upgrade."
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                    <FormWizardArrayInput
                        id="upgrade-posthooks"
                        path="spec.upgrade.posthook"
                        label="Post-upgrade jobs"
                        description="Ansible job templates run after cluster upgrade."
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}

function AnsibleWizardJobTemplate() {
    return (
        <Fragment>
            <FormWizardTextInput
                id="name"
                label="Ansible job template name"
                placeholder="Enter or select Ansible job template name"
                required
            />
            <FormWizardKeyValue id="extra_vars" label="Extra variables" placeholder="Add variable" />
        </Fragment>
    )
}
