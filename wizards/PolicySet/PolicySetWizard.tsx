import get from 'get-value'
import { Fragment, ReactNode, useMemo } from 'react'
import {
    EditMode,
    ItemContext,
    ItemSelector,
    Section,
    SingleSelect,
    Step,
    TableSelect,
    TextArea,
    TextInput,
    WizardCancel,
    WizardPage,
    WizardSubmit,
} from '../../src'
import { useItem } from '../../src/contexts/ItemContext'
import { IResource } from '../common/resource'
import { IClusterSetBinding } from '../common/resources/IClusterSetBinding'
import { PlacementBindingKind, PlacementBindingType } from '../common/resources/IPlacementBinding'
import { PlacementRuleApiGroup, PlacementRuleKind, PlacementRuleType } from '../common/resources/IPlacementRule'
import { PolicyApiVersion, PolicyKind } from '../common/resources/IPolicy'
import { PolicySetApiGroup, PolicySetKind, PolicySetType } from '../common/resources/IPolicySet'
import { Sync } from '../common/Sync'
import { isValidKubernetesResourceName } from '../common/validation'
import { PlacementSection } from '../Placement/PlacementSection'

export interface PolicySetWizardProps {
    breadcrumb?: { label: string; to?: string }[]
    title: string
    namespaces: string[]
    policies: IResource[]
    placements: IResource[]
    placementRules: IResource[]
    clusters: IResource[]
    clusterSets: IResource[]
    clusterSetBindings: IClusterSetBinding[]
    editMode?: EditMode
    resources?: IResource[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    yamlEditor?: () => ReactNode
}

export function PolicySetWizard(props: PolicySetWizardProps) {
    const policySet = props.resources?.find((resource) => resource.kind === PolicySetKind)
    const virtualPolicies = useMemo(() => {
        const virtualPolicies = [...props.policies]
        if (policySet) {
            const policies = get(policySet, 'spec.policies') ?? []
            for (const policyName of policies) {
                if (
                    !virtualPolicies.find(
                        (policy) => policy.metadata?.name === policyName && policy.metadata?.namespace === policySet.metadata?.namespace
                    )
                ) {
                    virtualPolicies.push({
                        apiVersion: PolicyApiVersion,
                        kind: PolicyKind,
                        metadata: {
                            name: policyName,
                            namespace: policySet.metadata?.namespace,
                        },
                    })
                }
            }
        }

        return virtualPolicies
    }, [policySet, props.policies])

    return (
        <WizardPage
            title={props.title}
            breadcrumb={props.breadcrumb}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            editMode={props.editMode}
            defaultData={
                props.resources ?? [
                    {
                        ...PolicySetType,
                        metadata: { name: '', namespace: '' },
                        spec: { description: '', policies: [] },
                    },
                    {
                        ...PlacementRuleType,
                        metadata: { name: '', namespace: '' },
                        spec: { clusterSelector: { matchExpressions: [] } },
                    },
                    {
                        ...PlacementBindingType,
                        metadata: { name: '', namespace: '' },
                        placementRef: { apiGroup: PlacementRuleApiGroup, kind: PlacementRuleKind, name: '' },
                        subjects: [{ apiGroup: PolicySetApiGroup, kind: PolicySetKind, name: '' }],
                    } as IResource,
                ]
            }
            yamlEditor={props.yamlEditor}
        >
            <Step label="Details" id="details-step">
                {props.editMode !== EditMode.Edit && (
                    <Fragment>
                        <Sync kind={PolicySetKind} path="metadata.name" suffix="-placement" />
                        <Sync kind={PolicySetKind} path="metadata.name" suffix="-placement" />
                        <Sync kind={PolicySetKind} path="metadata.name" targetKind={PlacementBindingKind} targetPath="subjects.0.name" />
                    </Fragment>
                )}
                <Sync kind={PolicySetKind} path="metadata.namespace" />
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue={PolicySetKind}>
                        <ItemContext.Consumer>
                            {(item: IResource) => (
                                <Fragment>
                                    <TextInput
                                        label="Name"
                                        path="metadata.name"
                                        id="name"
                                        required
                                        validation={isValidKubernetesResourceName}
                                        readonly={item.metadata?.uid !== undefined}
                                    />
                                    <TextArea label="Description" path="spec.description" />
                                    <SingleSelect
                                        label="Namespace"
                                        path="metadata.namespace"
                                        id="namespace"
                                        required
                                        options={props.namespaces}
                                        readonly={item.metadata?.uid !== undefined}
                                    />
                                </Fragment>
                            )}
                        </ItemContext.Consumer>
                    </ItemSelector>
                </Section>
            </Step>
            <Step label="Policies" id="policies-step">
                <PoliciesSection policies={virtualPolicies} />
            </Step>
            <Step label="Placement" id="placement-step">
                <PlacementSection
                    existingClusterSets={props.clusterSets}
                    existingClusterSetBindings={props.clusterSetBindings}
                    bindingSubjectKind={PolicySetKind}
                    bindingSubjectApiGroup={PolicySetApiGroup}
                    existingPlacements={props.placements}
                    existingPlacementRules={props.placementRules}
                    defaultPlacementKind={PlacementRuleKind}
                    clusters={props.clusters}
                />
            </Step>
        </WizardPage>
    )
}

function PoliciesSection(props: { policies: IResource[] }) {
    const resources = useItem() as IResource[]
    const namespacedPolicies = useMemo(() => {
        if (!resources.find) return []
        const policySet = resources?.find((resource) => resource.kind === PolicySetKind)
        if (!policySet) return []
        const namespace = policySet.metadata?.namespace
        if (!namespace) return []
        return props.policies.filter((policy) => policy.metadata?.namespace === namespace)
    }, [props.policies, resources])
    return (
        <Section label="Policies">
            <ItemSelector selectKey="kind" selectValue={PolicySetKind}>
                <TableSelect
                    id="policies"
                    path="spec.policies"
                    label=""
                    columns={[
                        { name: 'Name', cellFn: (policy: IResource) => policy.metadata?.name },
                        { name: 'Namespace', cellFn: (policy: IResource) => policy.metadata?.namespace },
                        { name: '', cellFn: (policy: IResource) => (policy.metadata?.uid ? '' : 'Not found') },
                    ]}
                    items={namespacedPolicies}
                    itemToValue={(policy: IResource) => policy.metadata?.name}
                    valueMatchesItem={(value: unknown, policy: IResource) => value === policy.metadata?.name}
                    emptyTitle="No policies available for selection."
                    emptyMessage="Select a namespace to be able to select policies in that namespace."
                />
            </ItemSelector>
        </Section>
    )
}
