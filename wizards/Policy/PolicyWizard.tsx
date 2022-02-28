import { Button, Text, Title } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, useContext } from 'react'
import set from 'set-value'
import {
    ArrayInput,
    Checkbox,
    EditMode,
    Hidden,
    ItemSelector,
    Radio,
    RadioGroup,
    Section,
    Select,
    Step,
    StringsInput,
    StringsMapInput,
    TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'
import { ItemContext } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { IClusterSetBinding } from '../common/resources/IClusterSetBinding'
import { PlacementBindingKind } from '../common/resources/IPlacementBinding'
import { PlacementRuleKind } from '../common/resources/IPlacementRule'
import { PolicyApiGroup, PolicyKind, PolicyType } from '../common/resources/IPolicy'
import { Sync } from '../common/Sync'
import { isValidKubernetesName } from '../common/validation'
import { PlacementSection } from '../Placement/PlacementSection'
import { Specifications } from './templates'

export function PolicyWizard(props: {
    title: string
    namespaces: string[]
    policies: IResource[]
    placements: IResource[]
    placementRules: IResource[]
    clusterSetBindings: IClusterSetBinding[]
    editMode?: EditMode
    resources?: IResource[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
}) {
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
            title={props.title}
            description="A policy generates reports and validates cluster compliance based on specified security standards, categories, and controls."
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            editMode={props.editMode}
            defaultData={
                props.resources ?? [
                    {
                        ...PolicyType,
                        metadata: { name: '', namespace: '' },
                        spec: { remediationAction: 'inform', disabled: false },
                    },
                ]
            }
        >
            <Step label="Details" id="details">
                {props.editMode !== EditMode.Edit && (
                    <Fragment>
                        <Sync kind={PolicyKind} path="metadata.namespace" />
                        <Sync kind={PolicyKind} path="metadata.name" prefix="-placement" />
                        <Sync kind={PolicyKind} path="metadata.name" targetKind={PlacementBindingKind} targetPath="subjects.0.name" />
                    </Fragment>
                )}

                <Sync kind={PolicyKind} path="metadata.namespace" />
                <ItemSelector selectKey="kind" selectValue={PolicyKind}>
                    <Section label="Details" prompt="Enter the details for the policy">
                        <TextInput
                            id="name"
                            path="metadata.name"
                            label="Name"
                            required
                            validation={isValidKubernetesName}
                            disabledInEditMode
                        />
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
                            disabledInEditMode
                        />
                        <RadioGroup path="spec.remediationAction" label="Remediation" required>
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
                            path="spec.disabled"
                            label="Disable policy"
                            helperText="Select to disable the policy from being propagated to managed clusters."
                        />
                    </Section>
                </ItemSelector>
            </Step>

            <Step label="Policy templates" id="templates">
                <ItemSelector selectKey="kind" selectValue={PolicyKind}>
                    <PolicyWizardTemplates />
                </ItemSelector>
            </Step>

            <Step label="Cluster placement" id="placement">
                <PlacementSection
                    existingPlacements={props.placements}
                    existingPlacementRules={props.placementRules}
                    existingclusterSetBindings={props.clusterSetBindings}
                    bindingSubjectKind={PolicyKind}
                    bindingSubjectApiGroup={PolicyApiGroup}
                    defaultPlacementKind={PlacementRuleKind}
                />
            </Step>

            <Step label="Security groups" id="security-groups">
                <ItemSelector selectKey="kind" selectValue={PolicyKind}>
                    <Section label="Security groups">
                        <StringsMapInput
                            id="categories"
                            path={`metadata.annotations.policy\\.open-cluster-management\\.io/categories`}
                            label="Categories"
                            map={(value: string | undefined) => {
                                return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                            }}
                            unmap={(values: string[]) => values.join(', ')}
                        />
                        <StringsMapInput
                            id="standards"
                            path={`metadata.annotations.policy\\.open-cluster-management\\.io/standards`}
                            label="Standards"
                            map={(value: string | undefined) => {
                                return value !== undefined ? value.split(',').map((v) => v.trim()) : []
                            }}
                            unmap={(values: string[]) => values.join(', ')}
                        />
                        <StringsMapInput
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
                required
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
                defaultCollapsed
            >
                {/* CertificatePolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'CertificatePolicy'}>
                    <div>
                        <Title headingLevel="h6">Certificate Policy</Title>
                        {/* <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text> */}
                    </div>

                    <TextInput
                        path="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />
                    <TextInput path="objectDefinition.spec.minimumDuration" label="Minimum duration" required />
                </Hidden>

                {/* IamPolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'IamPolicy'}>
                    <div>
                        <Title headingLevel="h6">IAM Policy</Title>
                        {/* <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text> */}
                    </div>

                    <TextInput
                        path="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />
                    {/* TODO NumberInput */}
                    <TextInput path="objectDefinition.spec.maxClusterRoleBindingUsers" label="Limit cluster role bindings" required />
                </Hidden>

                {/* ConfigurationPolicy */}
                <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'ConfigurationPolicy'}>
                    <div>
                        <Title headingLevel="h6">Configuration Policy</Title>
                        <Text component="small">A configuration policy creates configuration objects on managed clusters.</Text>
                    </div>

                    <TextInput
                        path="objectDefinition.metadata.name"
                        label="Name"
                        required
                        helperText="Name needs to be unique to the namespace on each of the managed clusters."
                    />

                    <ArrayInput
                        path="objectDefinition.spec.object-templates"
                        label="Configuration objects"
                        placeholder="Add configuration object"
                        collapsedContent="objectDefinition.metadata.name"
                    >
                        {/* Namespace */}
                        <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'Namespace'}>
                            <TextInput path="objectDefinition.metadata.name" label="Namespace" required />
                        </Hidden>

                        {/* LimitRange */}
                        <Hidden hidden={(template: any) => template?.objectDefinition?.kind !== 'LimitRange'}>
                            <TextInput
                                path="objectDefinition.metadata.name"
                                label="Name"
                                required
                                helperText="Name needs to be unique to the namespace on each of the managed clusters."
                            />
                            <ArrayInput
                                path="objectDefinition.spec.limits"
                                label="Limits"
                                placeholder="Add limit"
                                collapsedContent={'default.memory'}
                            >
                                <TextInput
                                    path="default.memory"
                                    label="Memory limit"
                                    placeholder="Enter memory limit"
                                    required
                                    helperText="Examples: 512Mi, 2Gi"
                                />
                                <TextInput
                                    path="defaultRequest.memory"
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
                                path="objectDefinition.metadata.name"
                                label="Name"
                                required
                                helperText="Name needs to be unique to the namespace on each of the managed clusters."
                            />
                            <Checkbox path="objectDefinition.allowHostDirVolumePlugin" label="Allow host dir volume plugin" />
                            <Checkbox path="objectDefinition.allowHostIPC" label="Allow host IPC" />
                            <Checkbox path="objectDefinition.allowHostNetwork" label="Allow host network" />
                            <Checkbox path="objectDefinition.allowHostPID" label="Allow host PID" />
                            <Checkbox path="objectDefinition.allowHostPorts" label="Allow host ports" />
                            <Checkbox path="objectDefinition.allowPrivilegeEscalation" label="Allow privilege escalation" />
                            <Checkbox path="objectDefinition.allowPrivilegedContainer" label="Allow privileged container" />
                        </Hidden>
                    </ArrayInput>
                </Hidden>

                <Hidden hidden={(template: any) => template.objectDefinition.spec.namespaceSelector === undefined}>
                    <StringsInput
                        id="include-namespaces"
                        path="objectDefinition.spec.namespaceSelector.include"
                        label="Include namespaces"
                        placeholder="Add namespace"
                    />
                    <StringsInput
                        id="exclude-namespaces"
                        path="objectDefinition.spec.namespaceSelector.exclude"
                        label="Exclude namespaces"
                        placeholder="Add namespace"
                    />
                </Hidden>

                <Select
                    path="objectDefinition.spec.severity"
                    label="Severity"
                    placeholder="Select severity"
                    options={['low', 'medium', 'high']}
                    required
                />
            </ArrayInput>
        </Section>
    )
}
