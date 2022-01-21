import { Button, Text, Title } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useContext } from 'react'
import set from 'set-value'
import {
    FormCancel,
    FormSubmit,
    ArrayInput,
    Checkbox,
    Hidden,
    Radio,
    RadioGroup,
    Select,
    ItemSelector,
    Section,
    Step,
    StringsInput,
    TextInput,
    WizardPage,
} from '../../src'
import { ItemContext } from '../../src/contexts/ItemContext'
import { Specifications } from './templates'

export function PolicyWizard(props: { onSubmit: FormSubmit; onCancel: FormCancel; namespaces: string[] }) {
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
        <WizardPage
            title="Create policy"
            description="A policy generates reports and validates cluster compliance based on specified security standards, categories, and controls."
            defaultData={[
                {
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'Policy',
                    metadata: { name: '', namespace: '' },
                    spec: { remediationAction: 'inform' },
                },
            ]}
            // sync={{
            //     source: { key: 'kind', value: 'Policy', path: 'metadata.namespace' },
            //     targets: [
            //         { key: 'kind', value: 'PlacementBinding', path: 'metadata.namespace' },
            //         { key: 'kind', value: 'PlacementRule', path: 'metadata.namespace' },
            //     ],
            // }}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <Step label="Details">
                <ItemSelector selectKey="kind" selectValue="Policy">
                    <Section label="Details" prompt="Enter the details for the policy">
                        <TextInput id="name" path="metadata.name" label="Name" placeholder="Enter name" required />
                        <Select
                            id="namespace"
                            path="metadata.namespace"
                            label="Namespace"
                            placeholder="Select namespace"
                            helperText="The namespace on the hub cluster where the policy resources will be created."
                            options={props.namespaces}
                            required
                            footer={
                                <Button variant="link" isInline>
                                    Create new namespace
                                </Button>
                            }
                        />
                        <RadioGroup id="spec.remediationAction" path="spec.remediationAction" label="Remediation" required>
                            <Radio
                                id="inform"
                                label="Inform"
                                value="inform"
                                description="Reports the violation, which requires manual remediation."
                            />
                            <Radio
                                id="enforce"
                                label="Enforce"
                                value="enforce"
                                description="Automatically runs remediation action that is defined in the source, if this feature is supported."
                            />
                        </RadioGroup>
                        <Checkbox
                            id="spec.disabled"
                            label="Disable policy"
                            helperText="Select to disable the policy from being propagated to managed clusters."
                        />
                    </Section>
                </ItemSelector>
            </Step>

            <Step label="Templates">
                <ItemSelector selectKey="kind" selectValue="Policy">
                    <PolicyWizardTemplates />
                </ItemSelector>
            </Step>

            <Step label="Placement">
                <PolicyWizardPlacement />
            </Step>

            <Step label="Security groups">
                <ItemSelector selectKey="kind" selectValue="Policy">
                    <Section label="Security groups">
                        <StringsInput
                            id="categories"
                            path={`metadata.annotations.policy\\.open-cluster-management\\.io/categories`}
                            label="Categories"
                            map={(value: string | undefined) => {
                                return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                            }}
                            unmap={(values: string[]) => values.join(', ')}
                        />
                        <StringsInput
                            id="standards"
                            path={`metadata.annotations.policy\\.open-cluster-management\\.io/standards`}
                            label="Standards"
                            map={(value: string | undefined) => {
                                return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                            }}
                            unmap={(values: string[]) => values.join(', ')}
                        />
                        <StringsInput
                            id="controls"
                            path={`metadata.annotations.policy\\.open-cluster-management\\.io/controls`}
                            label="Controls"
                            map={(value: string | undefined) => {
                                return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                            }}
                            unmap={(values: string[]) => values.join(', ')}
                        />
                    </Section>
                </ItemSelector>
            </Step>
        </WizardPage>
    )
}

export function PolicyWizardTemplates() {
    const policy = useContext(ItemContext)
    return (
        <Section label="Templates" description="A policy contains  policy templates that create policies on managed clusters.">
            <ArrayInput
                id="templates"
                path="spec.policy-templates"
                label="Policy templates"
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

                            const copy = JSON.parse(JSON.stringify(specification.replacements.policyTemplates)) as any[]

                            const policyName = get(policy, 'metadata.name')
                            if (policyName) {
                                copy.forEach((t) => {
                                    const name: string = get(t, 'objectDefinition.metadata.name')
                                    if (name) {
                                        set(t, 'objectDefinition.metadata.name', name.replace('{{name}}', policyName))
                                    }
                                })
                            }

                            return copy
                        },
                    }
                })}
                collapsedContent="objectDefinition.metadata.name"
            >
                {/* CertificatePolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'CertificatePolicy'}>
                    <div>
                        <Title headingLevel="h6">Certificate Policy</Title>
                        {/* <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text> */}
                    </div>

                    <TextInput
                        id="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />
                    <TextInput id="objectDefinition.spec.minimumDuration" label="Minimum duration" required />
                </Hidden>

                {/* IamPolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'IamPolicy'}>
                    <div>
                        <Title headingLevel="h6">IAM Policy</Title>
                        {/* <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text> */}
                    </div>

                    <TextInput
                        id="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />
                    {/* TODO FormWizardNumberInput */}
                    <TextInput id="objectDefinition.spec.maxClusterRoleBindingUsers" label="Limit cluster role bindings" required />
                </Hidden>

                {/* ConfigurationPolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'ConfigurationPolicy'}>
                    <div>
                        <Title headingLevel="h6">Configuration Policy</Title>
                        <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text>
                    </div>

                    <TextInput
                        id="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />

                    <ArrayInput
                        id="objectDefinition.spec.object-templates"
                        label="Configuration objects"
                        placeholder="Add configuration object"
                        collapsedContent="objectDefinition.metadata.name"
                    >
                        {/* Namespace */}
                        <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'Namespace'}>
                            <TextInput id="objectDefinition.metadata.name" label="Namespace" required />
                        </Hidden>

                        {/* LimitRange */}
                        <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'LimitRange'}>
                            <TextInput
                                id="objectDefinition.metadata.name"
                                label="Name"
                                required
                                helperText="Name needs to be unique to the namespace on each of the managed clusters."
                            />
                            <ArrayInput
                                id="objectDefinition.spec.limits"
                                label="Limits"
                                placeholder="Add limit"
                                collapsedContent={'default.memory'}
                            >
                                <TextInput
                                    id="default.memory"
                                    label="Memory limit"
                                    placeholder="Enter memory limit"
                                    required
                                    helperText="Examples: 512Mi, 2Gi"
                                />
                                <TextInput
                                    id="defaultRequest.memory"
                                    label="Memory request"
                                    placeholder="Enter memory request"
                                    required
                                    helperText="Examples: 512Mi, 2Gi"
                                />
                            </ArrayInput>
                        </Hidden>

                        {/* SecurityContextConstraints */}
                        <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'SecurityContextConstraints'}>
                            <TextInput
                                id="objectDefinition.metadata.name"
                                label="Name"
                                required
                                helperText="Name needs to be unique to the namespace on each of the managed clusters."
                            />
                            <Checkbox id="objectDefinition.allowHostDirVolumePlugin" label="Allow host dir volume plugin" />
                            <Checkbox id="objectDefinition.allowHostIPC" label="Allow host IPC" />
                            <Checkbox id="objectDefinition.allowHostNetwork" label="Allow host network" />
                            <Checkbox id="objectDefinition.allowHostPID" label="Allow host PID" />
                            <Checkbox id="objectDefinition.allowHostPorts" label="Allow host ports" />
                            <Checkbox id="objectDefinition.allowPrivilegeEscalation" label="Allow privilege escalation" />
                            <Checkbox id="objectDefinition.allowPrivilegedContainer" label="Allow privileged container" />
                        </Hidden>
                    </ArrayInput>
                </Hidden>

                <Hidden hidden={(template: any) => template.objectDefinition.spec.namespaceSelector === undefined}>
                    <StringsInput
                        id="include-namespaces"
                        path="objectDefinition.spec.namespaceSelector.include"
                        label="Include namespaces"
                    />
                    <StringsInput
                        id="exclude-namespaces"
                        path="objectDefinition.spec.namespaceSelector.exclude"
                        label="Exclude namespaces"
                    />
                </Hidden>

                <Select
                    id="objectDefinition.spec.severity"
                    label="Severity"
                    placeholder="Select severity"
                    options={['low', 'medium', 'high']}
                    required
                />
            </ArrayInput>
        </Section>
    )
}

export function PolicyWizardPlacement() {
    return (
        <Fragment>
            <Section label="Placement">
                <ArrayInput
                    id="placement-rules"
                    label="Placement rules"
                    description="Placement rules determine which clusters a policy will be applied."
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementRule'}
                    placeholder="Add placement rule"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter placement rule"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementRule',
                        metadata: {},
                        spec: {
                            clusterConditions: { status: 'True', type: 'ManagedClusterConditionAvailable' },
                            clusterSelector: {
                                matchExpressions: [{ key: '', operator: 'In', values: [''] }],
                            },
                        },
                    }}
                    // hidden={(rules) => !rules.length}
                >
                    <TextInput
                        id="name"
                        path="metadata.name"
                        label="Name"
                        required
                        helperText="The name of the placement rule should match the rule name in a placement binding so that it is bound to a policy."
                    />
                    <ArrayInput
                        id="matchExpressions"
                        label="Match expressions"
                        path="spec.clusterSelector.matchExpressions"
                        placeholder="Add expression"
                        collapsedPlaceholder="Expand to enter expression"
                        collapsedContent={'key'}
                        newValue={{
                            key: '',
                            operator: 'In',
                            values: [''],
                        }}
                    >
                        <TextInput id="key" path="key" label="Label" />
                        <StringsInput id="values" path="values" label="Equals one of" />
                    </ArrayInput>
                </ArrayInput>

                <ArrayInput
                    id="placement-bindings"
                    label="Placement bindings"
                    description="Policies are applied to clusters using placement bindings. Placement bindings bind policies to a placement rule."
                    path={null}
                    filter={(resource) => resource.kind === 'PlacementBinding'}
                    placeholder="Add placement binding"
                    collapsedContent="metadata.name"
                    collapsedPlaceholder="Expand to enter placement binding"
                    newValue={{
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PlacementBinding',
                        metadata: {},
                        placementRef: { apiGroup: 'apps.open-cluster-management.io', kind: 'PlacementRule' },
                        subjects: [{ apiGroup: 'policy.open-cluster-management.io', kind: 'Policy' }],
                    }}
                    // hidden={(bindings) => !bindings.length}
                >
                    <TextInput id="metadata.name" label="Binding name" required />
                    <TextInput
                        id="placementRef.name"
                        label="Rule name"
                        helperText="The placement rule name that his placement binding is binding to the subjects."
                        required
                    />
                    <ArrayInput
                        id="sss"
                        path="subjects"
                        label="Subjects"
                        description="Placement bindings can have multiple subjects which the placement is applied to."
                        placeholder="Add placement subject"
                        collapsedContent="name"
                        collapsedPlaceholder="Expand to enter subject"
                        newValue={{
                            apiGroup: 'policy.open-cluster-management.io',
                            kind: 'Policy',
                        }}
                    >
                        <TextInput id="name" path="name" label="Subject name" required />
                    </ArrayInput>
                </ArrayInput>
            </Section>
        </Fragment>
    )
}
