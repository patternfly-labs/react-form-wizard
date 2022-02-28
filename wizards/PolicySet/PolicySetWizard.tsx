import { Fragment, useMemo } from 'react'
import {
    EditMode,
    ItemSelector,
    Section,
    Select,
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
import { PolicySetApiGroup, PolicySetKind, PolicySetType } from '../common/resources/IPolicySet'
import { Sync } from '../common/Sync'
import { isValidKubernetesName } from '../common/validation'
import { PlacementSection } from '../Placement/PlacementSection'

export interface PolicySetWizardProps {
    breadcrumb?: { label: string; to?: string }[]
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
}

export function PolicySetWizard(props: PolicySetWizardProps) {
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
        >
            <Step label="Details" id="details-step">
                {props.editMode !== EditMode.Edit && (
                    <Fragment>
                        <Sync kind={PolicySetKind} path="metadata.name" prefix="-placement" />
                        <Sync kind={PolicySetKind} path="metadata.name" prefix="-placement" />
                        <Sync kind={PolicySetKind} path="metadata.name" targetKind={PlacementBindingKind} targetPath="subjects.0.name" />
                    </Fragment>
                )}
                <Sync kind={PolicySetKind} path="metadata.namespace" />
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue={PolicySetKind}>
                        <TextInput
                            label="Name"
                            path="metadata.name"
                            id="name"
                            required
                            validation={isValidKubernetesName}
                            disabledInEditMode
                        />
                        <TextArea label="Description" path="spec.description" />
                        <Select
                            label="Namespace"
                            path="metadata.namespace"
                            id="namespace"
                            required
                            options={props.namespaces}
                            disabledInEditMode
                        />
                    </ItemSelector>
                </Section>
            </Step>
            <Step label="Policies" id="policies-step">
                <PoliciesSection policies={props.policies} />
            </Step>
            <Step label="Placement" id="placement-step">
                <PlacementSection
                    existingclusterSetBindings={props.clusterSetBindings}
                    bindingSubjectKind={PolicySetKind}
                    bindingSubjectApiGroup={PolicySetApiGroup}
                    existingPlacements={props.placements}
                    existingPlacementRules={props.placementRules}
                    defaultPlacementKind={PlacementRuleKind}
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
        <Section label="Policies" description="Select the policies you want to add to this set">
            <ItemSelector selectKey="kind" selectValue={PolicySetKind}>
                <TableSelect
                    id="policies"
                    path="spec.policies"
                    label=""
                    columns={[
                        { name: 'Name', cellFn: (policy: IResource) => policy.metadata?.name },
                        { name: 'Namespace', cellFn: (policy: IResource) => policy.metadata?.namespace },
                    ]}
                    items={namespacedPolicies}
                    itemToValue={(policy: IResource) => policy.metadata?.name}
                    valueMatchesItem={(value: unknown, policy: IResource) => value === policy.metadata?.name}
                    emptyMessage="No policies available for selection. Set the namespace to be able to select policies in that namespace."
                />
            </ItemSelector>
        </Section>
    )
}
