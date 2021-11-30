import { Split } from '@patternfly/react-core'
import { Fragment, useMemo } from 'react'
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

export function AnsibleForm(props: { onSubmit?: FormSubmit }) {
    const credentials = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    return (
        <FormWizardPage
            title="Create Ansible template"
            template={AnsibleHandlebars}
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Automation' }]}
            onSubmit={props.onSubmit}
        >
            <FormWizardStep label="Details">
                <FormWizardSection
                    label="Details"
                    prompt="Configure the Ansible job template"
                    description="The Ansible job templates that you select appear automatically during cluster creation. To create a sequence of events, select multiple jobs."
                >
                    <FormWizardTextInput id="name" label="Template name" placeholder="Enter the template name" required />
                    <FormWizardSelect
                        id="credential"
                        label="Ansible Automation Platform credential"
                        placeholder="Select the credential"
                        options={credentials}
                        required
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Install">
                <FormWizardSection
                    label="Pre-install jobs"
                    prompt="Pre-install Ansible job templates"
                    description="Ansible job templates run before cluster installation."
                >
                    <FormWizardArrayInput
                        id={`install.preJobs`}
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </FormWizardArrayInput>
                </FormWizardSection>
                <FormWizardSection
                    label="Pre-install jobs"
                    prompt="Post-install Ansible job templates"
                    description="Ansible job templates run after cluster installation."
                >
                    <FormWizardArrayInput
                        id={`install.postJobs`}
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Upgrade">
                <FormWizardSection
                    label="Pre-upgrade jobs"
                    prompt="Pre-upgrade Ansible job templates"
                    description="Ansible job templates run before cluster upgrade."
                >
                    <FormWizardArrayInput
                        id={`upgrade.preJobs`}
                        placeholder="Add job template"
                        collapsedText={<FormWizardTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </FormWizardArrayInput>
                </FormWizardSection>
                <FormWizardSection
                    label="Post-upgrade jobs"
                    prompt="Post-upgrade Ansible job templates"
                    description="Ansible job templates run after cluster upgrade."
                >
                    <FormWizardArrayInput
                        id={`upgrade.postJobs`}
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

interface IAnsibleVariableData {
    variable: string
    value: string
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
                        <FormWizardHidden hidden={(item: IAnsibleVariableData) => item.variable === undefined}>
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
