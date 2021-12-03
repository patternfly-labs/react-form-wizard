import { Button } from '@patternfly/react-core'
import { Fragment, useMemo } from 'react'
import {
    FormWizardArrayInput,
    FormWizardCheckbox,
    FormWizardHidden,
    FormWizardLabels,
    FormWizardPage,
    FormWizardRadio,
    FormWizardRadioGroup,
    FormWizardSection,
    FormWizardSelect,
    FormWizardStep,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'
import { Placement } from '../Application/AppForm'
import PolicyTemplate from './PolicyTemplate.hbs'
import { Specifications } from './templates'

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
    // const specifications = useMemo(
    //     () => Specifications.map((specification) => ({ id: specification.name, label: specification.description, value: specification })),
    //     []
    // )
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
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Governance' }]}
            defaultData={{
                apiVersion: 'policy.open-cluster-management.io/v1',
                kind: 'Policy',
                metadata: { name: '', namespace: '' },
                spec: { remediationAction: 'inform' },
            }}
        >
            <FormWizardStep label="Details">
                <FormWizardSection label="Details">
                    <FormWizardTextInput id="metadata.name" label="Name" placeholder="Enter name" required />
                    <FormWizardSelect
                        id="metadata.namespace"
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
                        id="spec.severity"
                        label="Severity"
                        placeholder="Select severity"
                        options={['Low', 'Medium', 'High']}
                        required
                    />
                    <FormWizardRadioGroup id="spec.remediationAction" path="spec.remediationAction" label="Remediation" required>
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
                        id="spec.disabled"
                        label="Disable policy"
                        helperText="Select to disable the policy from being propagated to the managed cluster."
                    />
                </FormWizardSection>
            </FormWizardStep>

            <FormWizardStep label="Specification">
                <FormWizardSection
                    label="Specification"
                    description="A policy contains multiple templates that create policy resources on managed clusters."
                >
                    <FormWizardArrayInput
                        id="spec.policy-templates"
                        placeholder="Add policy template"
                        dropdownItems={Specifications.map((specification) => {
                            return {
                                label: specification.description,
                                action: () => specification.replacements.policyTemplates,
                            }
                        })}
                        collapsedText={
                            <Fragment>
                                <FormWizardTextDetail id="objectDefinition.kind" /> -{' '}
                                <FormWizardTextDetail id="objectDefinition.spec.object-templates.0.objectDefinition.kind" /> -{' '}
                                <FormWizardTextDetail id="objectDefinition.metadata.name" />
                            </Fragment>
                        }
                    >
                        {/* <FormWizardSelect
                            id="template"
                            label="Template"
                            keyPath="name"
                            placeholder="Select template"
                            options={specifications}
                            required
                        /> */}
                        <FormWizardTextDetail id="objectDefinition.kind" />
                        <FormWizardTextInput id="objectDefinition.metadata.name" label="Name" required />
                        <FormWizardSection
                            label="Namespace selector"
                            hidden={(template: any) => template?.objectDefinition?.spec?.namespaceSelector === undefined}
                        >
                            <FormWizardLabels id="objectDefinition.spec.namespaceSelector.include" label="Include namespaces" />
                            <FormWizardLabels id="objectDefinition.spec.namespaceSelector.exclude" label="Exclude namespaces" />
                        </FormWizardSection>
                        <FormWizardHidden
                            hidden={(template: any) =>
                                template?.objectDefinition?.spec?.['object-templates']?.[0]?.objectDefinition?.kind !== 'LimitRange'
                            }
                        >
                            <FormWizardSection label="Object templates">
                                <FormWizardArrayInput
                                    id="objectDefinition.spec.object-templates"
                                    placeholder="Add resource template"
                                    collapsedText={
                                        <Fragment>
                                            <FormWizardTextDetail id="objectDefinition.kind" /> -{' '}
                                            <FormWizardTextDetail id="objectDefinition.metadata.name" />
                                        </Fragment>
                                    }
                                >
                                    <FormWizardTextDetail id="objectDefinition.kind" />
                                    <FormWizardTextInput id="objectDefinition.metadata.name" label="Name" required />
                                    <FormWizardArrayInput
                                        id="objectDefinition.spec.limits"
                                        label="Limits"
                                        placeholder="Add limit"
                                        collapsedText={
                                            <Fragment>
                                                <FormWizardTextDetail id="objectDefinition.kind" /> -{' '}
                                                <FormWizardTextDetail id="objectDefinition.metadata.name" />
                                            </Fragment>
                                        }
                                    >
                                        <FormWizardTextInput
                                            id="default.memory"
                                            label="Memory limit"
                                            placeholder="Enter memory limit"
                                            required
                                            helperText="Examples: 512Mi, 2Gi"
                                        />
                                        <FormWizardTextInput
                                            id="defaultRequest.memory"
                                            label="Memory request"
                                            placeholder="Enter memory request"
                                            required
                                            helperText="Examples: 512Mi, 2Gi"
                                        />
                                    </FormWizardArrayInput>
                                </FormWizardArrayInput>
                            </FormWizardSection>
                        </FormWizardHidden>
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
