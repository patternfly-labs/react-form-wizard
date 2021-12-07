import { Button } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useContext, useMemo } from 'react'
import set from 'set-value'
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
    FormWizardSelector,
    FormWizardStep,
    FormWizardStringArray,
    FormWizardTextDetail,
    FormWizardTextInput,
} from '../../src'
import { FormWizardItemContext } from '../../src/contexts/FormWizardItemContext'
import { Specifications } from './templates'

export function PolicyWizard() {
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
            breadcrumb={[{ label: 'Home', to: '.' }, { label: 'Governance' }]}
            defaultData={[
                {
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'Policy',
                    metadata: { name: '', namespace: '' },
                    spec: { remediationAction: 'inform' },
                },
                {
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'PlacementRule',
                    metadata: {},
                    spec: {
                        clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' },
                        clusterSelector: {
                            matchExpressions: [],
                        },
                    },
                },
                {
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'PlacementBinding',
                    metadata: {},
                    placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                    subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                },
            ]}
            // sync={{
            //     source: { key: 'kind', value: 'Policy', path: 'metadata.namespace' },
            //     targets: [
            //         { key: 'kind', value: 'PlacementBinding', path: 'metadata.namespace' },
            //         { key: 'kind', value: 'PlacementRule', path: 'metadata.namespace' },
            //     ],
            // }}
        >
            <FormWizardStep label="Details">
                <FormWizardSelector selectKey="kind" selectValue="Policy">
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
                </FormWizardSelector>
            </FormWizardStep>

            <FormWizardStep label="Specification">
                <FormWizardSelector selectKey="kind" selectValue="Policy">
                    <PolicyWizardSpecification />
                </FormWizardSelector>
            </FormWizardStep>

            <FormWizardStep label="Placement">
                <PolicyWizardPlacement />
            </FormWizardStep>

            <FormWizardStep label="Security groups">
                <FormWizardSelector selectKey="kind" selectValue="Policy">
                    <FormWizardStringArray
                        id="categories"
                        path={`metadata.annotations.policy\\.open-cluster-management\\.io/categories`}
                        label="Categories"
                        placeholder="Add category"
                        map={(value: string | undefined) => {
                            return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                        }}
                        unmap={(values: string[]) => values.join(', ')}
                    />
                    <FormWizardStringArray
                        id="standards"
                        path={`metadata.annotations.policy\\.open-cluster-management\\.io/standards`}
                        label="Standards"
                        placeholder="Add standard"
                        map={(value: string | undefined) => {
                            return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                        }}
                        unmap={(values: string[]) => values.join(', ')}
                    />
                    <FormWizardStringArray
                        id="controls"
                        path={`metadata.annotations.policy\\.open-cluster-management\\.io/controls`}
                        label="Controls"
                        placeholder="Add control"
                        map={(value: string | undefined) => {
                            return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                        }}
                        unmap={(values: string[]) => values.join(', ')}
                    />
                </FormWizardSelector>
            </FormWizardStep>
            {/* <FormWizardStep label="Standards"></FormWizardStep>
            <FormWizardStep label="Controls"></FormWizardStep> */}
        </FormWizardPage>
    )
}

export function PolicyWizardSpecification() {
    const policy = useContext(FormWizardItemContext)
    return (
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
                        action: () => {
                            for (const group of ['categories', 'standards', 'controls']) {
                                const existingValue: string = get(
                                    policy,
                                    `metadata.annotations.policy\\.open-cluster-management\\.io/${group}`,
                                    ''
                                )
                                const addValue: string = get(specification, `replacements.${group}`, '')
                                const newValue: string = existingValue
                                    .split(',')
                                    .concat(addValue.split(','))
                                    .map((v) => v.trim())
                                    .filter((value, index, array) => array.indexOf(value) === index)
                                    .filter((value) => value)
                                    .join(', ')
                                set(policy, `metadata.annotations.policy\\.open-cluster-management\\.io/${group}`, newValue, {
                                    preservePaths: false,
                                })
                            }

                            return specification.replacements.policyTemplates
                        },
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
                <FormWizardTextDetail id="objectDefinition.kind" />
                <FormWizardTextInput id="objectDefinition.metadata.name" label="Name" required />
                <FormWizardSelect
                    id="objectDefinition.spec.severity"
                    label="Severity"
                    placeholder="Select severity"
                    options={['low', 'medium', 'high']}
                    required
                />
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
    )
}

export function PolicyWizardPlacement() {
    return (
        <Fragment>
            <FormWizardSection
                label="Placement bindings"
                description="Policies are applied to clusters using placement bindings. Placement bindings bind policies to a placement rule."
            >
                <FormWizardArrayInput
                    id="placementBindings"
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementBinding'}
                    placeholder="Add placement binding"
                    collapsedText="metadata.name"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementBinding',
                        metadata: {},
                        placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                        subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                    }}
                >
                    <FormWizardTextInput id="metadata.name" label="Placement binding name" required />
                    <FormWizardTextInput id="placementRef.name" label="Placement rule name" required />
                    <FormWizardArrayInput
                        id="sss"
                        path="subjects"
                        label="Placement subjects"
                        placeholder="Add placement subject"
                        collapsedText="name"
                        newValue={{
                            apiGroup: 'policy.open-cluster-management.io',
                            kind: 'Policy',
                        }}
                    >
                        <FormWizardTextInput id="name" label="Subject name" required />
                    </FormWizardArrayInput>
                </FormWizardArrayInput>
            </FormWizardSection>
            <FormWizardSection label="Placement rules" description="Placement rules determine which clusters a policy will be applied.">
                {/* <Alert variant="warning" isInline title="Note">
                    Placement rules can be used by mulitple placement bindings. Editing the placement rule will affect all placement
                    bindings using the rule.
                </Alert> */}
                <FormWizardArrayInput
                    id="placementRules"
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementRule'}
                    placeholder="Add placement rule"
                    collapsedText="metadata.name"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementRule',
                        metadata: {},
                        spec: {
                            clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' },
                            clusterSelector: {
                                matchExpressions: [],
                            },
                        },
                    }}
                >
                    <FormWizardTextInput id="metadata.name" label="Name" required />
                </FormWizardArrayInput>
            </FormWizardSection>
        </Fragment>
    )
}
