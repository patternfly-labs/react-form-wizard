import { Split } from '@patternfly/react-core'
import { Fragment, useMemo } from 'react'
import { InputArray, InputHidden, InputPage, InputSection, InputSelect, InputStep, InputText, InputTextDetail } from '../../src'
import AnsibleHandlebars from './Ansible.hbs'

export function AnsibleForm() {
    const credentials = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    return (
        <InputPage
            title="Create Ansible template"
            template={AnsibleHandlebars}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Automation' }]}
        >
            <InputStep label="Details">
                <InputSection
                    label="Details"
                    prompt="Configure the Ansible job template"
                    description="The Ansible job templates that you select appear automatically during cluster creation. To create a sequence of events, select multiple jobs."
                >
                    <InputText id="name" label="Template name" placeholder="Enter the template name" required />
                    <InputSelect
                        id="credential"
                        label="Ansible Automation Platform credential"
                        placeholder="Select the credential"
                        options={credentials}
                        required
                    />
                </InputSection>
            </InputStep>

            <InputStep label="Install">
                <InputSection
                    label="Pre-install jobs"
                    prompt="Pre-install Ansible job templates"
                    description="Ansible job templates run before cluster installation."
                >
                    <InputArray
                        id={`install.preJobs`}
                        placeholder="Add job template"
                        collapsedText={<InputTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </InputArray>
                </InputSection>
                <InputSection
                    label="Pre-install jobs"
                    prompt="Post-install Ansible job templates"
                    description="Ansible job templates run after cluster installation."
                >
                    <InputArray
                        id={`install.postJobs`}
                        placeholder="Add job template"
                        collapsedText={<InputTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </InputArray>
                </InputSection>
            </InputStep>

            <InputStep label="Upgrade">
                <InputSection
                    label="Pre-upgrade jobs"
                    prompt="Pre-upgrade Ansible job templates"
                    description="Ansible job templates run before cluster upgrade."
                >
                    <InputArray
                        id={`upgrade.preJobs`}
                        placeholder="Add job template"
                        collapsedText={<InputTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </InputArray>
                </InputSection>
                <InputSection
                    label="Post-upgrade jobs"
                    prompt="Post-upgrade Ansible job templates"
                    description="Ansible job templates run after cluster upgrade."
                >
                    <InputArray
                        id={`upgrade.postJobs`}
                        placeholder="Add job template"
                        collapsedText={<InputTextDetail id="name" placeholder="Expand to enter the Ansible job template" />}
                        sortable
                    >
                        <AnsibleJobTemplates />
                    </InputArray>
                </InputSection>
            </InputStep>
        </InputPage>
    )
}

function AnsibleJobTemplates() {
    return (
        <Fragment>
            <InputText id="name" label="Ansible job template name" placeholder="Enter or select Ansible job template name" required />
            <InputArray
                id="variables"
                label="Extra variables"
                placeholder="Add variable"
                collapsedText={
                    <Fragment>
                        <InputTextDetail id="variable" placeholder="Expand to enter the variable" />
                        <InputHidden hidden={(item) => item.variable === undefined}>
                            &nbsp;=&nbsp;
                            <InputTextDetail id="value" />
                        </InputHidden>
                    </Fragment>
                }
            >
                <Split hasGutter>
                    <InputText id="variable" label="Variable" placeholder="Enter the variable name" required />
                    <InputText id="value" label="Value" placeholder="Enter the value for the variable" required />
                </Split>
            </InputArray>
        </Fragment>
    )
}
