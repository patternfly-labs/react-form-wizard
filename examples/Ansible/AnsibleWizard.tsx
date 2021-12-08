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
                    <FormWizardTextInput id="metadata.name" label="Name" required />
                    <FormWizardSelect
                        id="metadata.namespace"
                        label="Namespace"
                        placeholder="Select the namespace"
                        helperText="The namespace on the hub cluster where the resources will be created."
                        options={['default']}
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Install">
                <FormWizardSelect
                    id="spec.install.towerAuthSecret"
                    label="Ansible credentials for install"
                    helperText="Ansible credentials for the running Ansible jobs during cluster install."
                    options={props.credentials}
                    required
                />

                <FormWizardSection
                    id="pre-install"
                    label="Pre-install jobs"
                    prompt="Pre-install Ansible job templates"
                    description="Ansible job templates run before cluster installation."
                >
                    <FormWizardArrayInput
                        id="spec.install.prehook"
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                </FormWizardSection>
                <FormWizardSection
                    id="post-install"
                    label="Post-install jobs"
                    prompt="Post-install Ansible job templates"
                    description="Ansible job templates run after cluster installation."
                >
                    <FormWizardArrayInput
                        id="spec.install.posthook"
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Upgrade">
                <FormWizardSelect
                    id="spec.upgrade.towerAuthSecret"
                    label="Ansible credentials for upgrade"
                    helperText="Ansible credentials for the running Ansible jobs during cluster upgrade."
                    options={props.credentials}
                    required
                />
                <FormWizardSection
                    id="pre-upgrade"
                    label="Pre-upgrade jobs"
                    prompt="Pre-upgrade Ansible job templates"
                    description="Ansible job templates run before cluster upgrade."
                >
                    <FormWizardArrayInput
                        id="spec.upgrade.prehook"
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleWizardJobTemplate />
                    </FormWizardArrayInput>
                </FormWizardSection>
                <FormWizardSection
                    id="post-upgrade"
                    label="Post-upgrade jobs"
                    prompt="Post-upgrade Ansible job templates"
                    description="Ansible job templates run after cluster upgrade."
                >
                    <FormWizardArrayInput
                        id="spec.upgrade.posthook"
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
