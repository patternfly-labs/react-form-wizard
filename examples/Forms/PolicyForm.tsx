import { Button } from '@patternfly/react-core'
import { useMemo } from 'react'
import {
    InputArray,
    InputCheckbox,
    InputPage,
    InputRadio,
    InputRadioGroup,
    InputSection,
    InputSelect,
    InputStep,
    InputText,
    InputTextDetail,
} from '../../src'
import { Specifications } from '../templates'
import { PlacementRules } from './AppForm'
import PolicyTemplate from './PolicyTemplate.hbs'

export function PolicyForm() {
    const namespaces = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    const clusterSelectors = useMemo(
        () =>
            ['cloud: "Amazon"', 'namespace-1', 'namespace-2'].map((selector) => ({
                id: selector,
                label: selector,
                value: selector,
            })),
        []
    )
    const specifications = useMemo(
        () => Specifications.map((specification) => ({ id: specification.name, label: specification.description, value: specification })),
        []
    )
    const standards = useMemo(
        () =>
            ['NIST', 'NIST-CSF', 'PCI', 'FISMA', 'HIPAA', 'NIST SP 800-53'].map((standard) => ({
                label: standard,
            })),
        []
    )
    const categories = useMemo(
        () =>
            [
                'PR.PT Protective Technology',
                'PR.DS Data Security',
                'PR.IP Information Protection Processes and Procedures',
                'PR.AC Identity Management and Access Control',
                'DE.CM Security Continuous Monitoring',
                'AC Access Control',
            ].map((category) => ({ label: category })),
        []
    )
    const controls = useMemo(
        () =>
            [
                'PR.PT-1 Audit Logging',
                'PR.PT-3 Least Functionality',
                'PR.DS-1 Data-at-rest',
                'PR.DS-2 Data-in-transit',
                'PR.AC-4 Access Control',
                'PR.AC-5 Network Integrity',
                'PR.IP-1 Baseline Configuration',
                'DE.CM-7 Monitoring for Unauthorized Activity',
                'DE.CM-8 Vulnerability Scans',
                'AC-3 Access Enforcement',
            ].map((control) => ({ label: control })),
        []
    )

    return (
        <InputPage
            title="Create policy"
            description="A policy generates reports and validates cluster compliance based on specified security standards, categories, and controls."
            template={PolicyTemplate}
            breadcrumb={[{ label: 'Home', to: '..' }, { label: 'Governance' }]}
            defaultData={{ templates: [{}] }}
        >
            <InputStep label="Details">
                <InputSection label="Details">
                    <InputText id="name" label="Name" placeholder="Enter name" required />
                    <InputSelect
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
                    <InputSelect
                        id="severity"
                        label="Severity"
                        placeholder="Select severity"
                        options={['Low', 'Medium', 'High']}
                        required
                    />
                    <InputRadioGroup id="remediation" label="Remediation" path="remediation" required>
                        <InputRadio
                            id="inform"
                            label="Inform"
                            value="inform"
                            description="Reports the violation, which requires manual remediation."
                        />
                        <InputRadio
                            id="enforce"
                            label="Enforce"
                            value="enforce"
                            description="Automatically runs remediation action that is defined in the source, if this feature is supported."
                        />
                    </InputRadioGroup>
                    <InputCheckbox
                        id="disable"
                        label="Disable policy"
                        path="disabled"
                        helperText="Select to disable the policy from being propagated to the managed cluster."
                    />
                </InputSection>
            </InputStep>

            <InputStep label="Specification">
                <InputSection label="Specification">
                    <InputArray
                        id="templates"
                        placeholder="Add policy template"
                        collapsedText={<InputTextDetail id="template.description" placeholder="Expand to select the template" />}
                        collapsedDescription={
                            <InputTextDetail id="template.replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory" />
                        }
                    >
                        <InputSelect
                            id="template"
                            label="Template"
                            keyPath="name"
                            placeholder="Select template"
                            options={specifications}
                            required
                        />
                        {/* <InputTextDetail id="replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory" /> */}
                        <InputText
                            id="template.replacements.policyTemplates.0.objectDefinition.spec.object-templates.0.objectDefinition.spec.limits.0.default.memory"
                            label="Memory limit"
                            placeholder="Enter memory limit"
                            required
                            hidden={(template) => template.template?.name !== 'LimitRange'}
                            helperText="Examples: 512Mi, 2Gi"
                        />
                    </InputArray>
                </InputSection>
            </InputStep>

            {/* <InputStep label="Specification">
                             <InputSelect
                                    variant="multi-path"

                    label="Standards"
                    helperText="The security standards your policy should validate."
                    path={'standards'}
                    options={standards}
                    placeholder="Select standards"
                />
                <InputSelect
                                    variant="multi-path"

                    label="Categories"
                    helperText="A security control category represent specific requirements for one or more standards."
                    path={'categories'}
                    options={categories}
                    placeholder="Select categories"
                />
                <InputSelect
                                    variant="multi-path"

                    label="Controls"
                    helperText="The control contains the instructions for ensuring that a policy meets the security requirements for one or more standards."
                    path={'controls'}
                    options={controls}
                    placeholder="Select controls"
                />
            </InputStep> */}

            <InputStep label="Placement">
                <PlacementRules />
            </InputStep>
        </InputPage>
    )
}
