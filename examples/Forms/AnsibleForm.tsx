import { Split } from '@patternfly/react-core'
import { Fragment } from 'react'
import {
    FormSubmit,
    FormWizardArrayInput,
    FormWizardHidden,
    FormWizardPage,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'
import AnsibleHandlebars from './Ansible.hbs'

export function AnsibleForm(props: { onSubmit?: FormSubmit; credentials: string[] }) {
    return (
        <FormWizardPage
            title="Create Ansible automation template"
            template={AnsibleHandlebars}
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
                        <AnsibleJobTemplates />
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
                        <AnsibleJobTemplates />
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
                        <AnsibleJobTemplates />
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
                        <AnsibleJobTemplates />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>
        </FormWizardPage>
    )
}

function AnsibleJobTemplates() {
    return (
        <Fragment>
            <FormWizardTextInput
                id="name"
                label="Ansible job template name"
                placeholder="Enter or select Ansible job template name"
                required
            />
            <FormWizardArrayInput
                id="variables"
                label="Extra variables"
                placeholder="Add variable"
                collapsedText={
                    <Fragment>
                        <FormWizardTextDetail id="variable" placeholder="Expand to enter the variable" />
                        <FormWizardHidden hidden={(item: { variable: string }) => item.variable === undefined}>
                            &nbsp;=&nbsp;
                            <FormWizardTextDetail id="value" />
                        </FormWizardHidden>
                    </Fragment>
                }
            >
                <Split hasGutter>
                    <FormWizardTextInput id="variable" label="Variable" placeholder="Enter the variable name" required />
                    <FormWizardTextInput id="value" label="Value" placeholder="Enter the value for the variable" required />
                </Split>
            </FormWizardArrayInput>
        </Fragment>
    )
}
