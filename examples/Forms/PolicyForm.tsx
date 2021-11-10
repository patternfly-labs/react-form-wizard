import { Button } from '@patternfly/react-core'
import { useMemo } from 'react'
import {
    FormWizardArrayInput,
    FormWizardCheckbox,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'
import { Specifications } from '../templates'
import { Placement } from './AppForm'
import PolicyTemplate from './PolicyTemplate.hbs'

export function PolicyForm() {
    const namespaces = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    // const clusterSelectors = useMemo(
    //     () =>
    //         ['cloud: "Amazon"', 'namespace-1', 'namespace-2'].map((selector) => ({
    //             id: selector,
    //             label: selector,
    //             value: selector,
    //         })),
    //     []
    // )
    const specifications = useMemo(
        () => Specifications.map((specification) => ({ id: specification.name, label: specification.description, value: specification })),
        []
    )
    // const standards = useMemo(
    //     () =>
    //         ['NIST', 'NIST-CSF', 'PCI', 'FISMA', 'HIPAA', 'NIST SP 800-53'].map((standard) => ({
    //             label: standard,
    //         })),
    //     []
    // )
    // const categories = useMemo(
    //     () =>
    //         [
    //             'PR.PT Protective Technology',
    //             'PR.DS Data Security',
    //             'PR.IP Information Protection Processes and Procedures',
    //             'PR.AC Identity Management and Access Control',
    //             'DE.CM Security Continuous Monitoring',
    //             'AC Access Control',
    //         ].map((category) => ({ label: category })),
    //     []
    // )
    // const controls = useMemo(
    //     () =>
    //         [
    //             'PR.PT-1 Audit Logging',
    //             'PR.PT-3 Least Functionality',
    //             'PR.DS-1 Data-at-rest',
    //             'PR.DS-2 Data-in-transit',
    //             'PR.AC-4 Access Control',
    //             'PR.AC-5 Network Integrity',
    //             'PR.IP-1 Baseline Configuration',
    //             'DE.CM-7 Monitoring for Unauthorized Activity',
    //             'DE.CM-8 Vulnerability Scans',
    //             'AC-3 Access Enforcement',
    //         ].map((control) => ({ label: control })),
    //     []
    // )

    return (
        <FormWizardPage
            title="Create policy"
            description="A policy generates reports and validates cluster compliance based on specified security standards, categories, and controls."
            template={PolicyTemplate}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Governance' }]}
            defaultData={{ templates: [{}] }}
        >
            <FormWizardStep label="Details">
                <FormWizardSection label="Details">
                    <FormWizardTextInput id="name" label="Name" placeholder="Enter name" required />
                    <FormWizardSelect
                        id="namespace"
                        label="Namespace"
                        placeholder="Select namespace"
                        helperText="The namespace on the hub cluster where the policy resources will be created."
                        options={namespaces}
                        required
                        footer={
                            <Button variant="link" isInline>
                                Create new namespace
                            </Button>
                        }
                    />
                    <FormWizardSelect
                        id="severity"
                        label="Severity"
                        placeholder="Select severity"
                        options={['Low', 'Medium', 'High']}
                        required
                    />
                    <FormWizardRadioGroup id="remediation" label="Remediation" path="remediation" required>
                        <FormWizardRadio
                            id="inform"
                            label="Inform"
                            value="inform"
                            description="Reports the violation, which requires manual remediation."
                        />
                        <FormWizardRadio
                            id="enforce"
                            label="Enforce"
                            value="enforce"
                            description="Automatically runs remediation action that is defined in the source, if this feature is supported."
                        />
                    </FormWizardRadioGroup>
                    <FormWizardCheckbox
                        id="disable"
                        label="Disable policy"
                        path="disabled"
                        helperText="Select to disable the policy from being propagated to the managed cluster."
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Specification">
                <FormWizardSection label="Specification">
                    <FormWizardArrayInput
                        id="templates"
                        placeholder="Add policy template"
                        collapsedText={<FormWizardTextDetail id="template.description" placeholder="Expand to select the template" />}
                        collapsedDescription={
                            <FormWizardTextDetail id="template.replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory" />
                        }
                    >
                        <FormWizardSelect
                            id="template"
                            label="Template"
                            keyPath="name"
                            placeholder="Select template"
                            options={specifications}
                            required
                        />
                        {/* <FormWizardTextDetail id="replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory" /> */}
                        <FormWizardTextInput
                            id="template.replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory"
                            label="Memory limit"
                            placeholder="Enter memory limit"
                            required
                            hidden={(template) => template.template?.name !== 'LimitRange'}
                            helperText="Examples: 512Mi, 2Gi"
                        />
                    </FormWizardArrayInput>
                </FormWizardSection>
            </FormWizardStep>

            {/* <FormWizardStep label="Specification">
                             <FormWizardSelect
                                    variant="multi-path"

                    label="Standards"
                    helperText="The security standards your policy should validate."
                    path={'standards'}
                    options={standards}
                    placeholder="Select standards"
                />
                <FormWizardSelect
                                    variant="multi-path"

                    label="Categories"
                    helperText="A security control category represent specific requirements for one or more standards."
                    path={'categories'}
                    options={categories}
                    placeholder="Select categories"
                />
                <FormWizardSelect
                                    variant="multi-path"

                    label="Controls"
                    helperText="The control contains the instructions for ensuring that a policy meets the security requirements for one or more standards."
                    path={'controls'}
                    options={controls}
                    placeholder="Select controls"
                />
            </InputStep> */}

            <FormWizardStep label="Placement">
                <Placement />
            </FormWizardStep>
        </FormWizardPage>
    )
}
