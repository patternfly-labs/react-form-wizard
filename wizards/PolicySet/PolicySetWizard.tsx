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
import { Sync } from '../common/Sync'
import { isValidKubernetesName } from '../common/validation'
import { IClusterSetBinding } from '../Placement/ClusterSetBinding'
import { PlacementBindingApiVersion } from '../Placement/PlacementBinding'
import { PlacementSection } from '../Placement/PlacementSection'

export interface PolicySetWizardProps {
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
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            editMode={props.editMode}
            defaultData={
                props.resources ?? [
                    {
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PolicySet',
                        metadata: { name: '', namespace: '' },
                        spec: { description: '', policies: [] },
                    },
                    {
                        apiVersion: 'apps.open-cluster-management.io/v1beta1',
                        kind: 'PlacementRule',
                        metadata: { name: '', namespace: '' },
                    },
                    {
                        apiVersion: PlacementBindingApiVersion,
                        kind: 'PlacementBinding',
                        metadata: { name: '', namespace: '' },
                        placementRef: {
                            name: '',
                            kind: 'PlacementRule',
                            apiGroup: 'apps.open-cluster-management.io',
                        },
                        subjects: [
                            {
                                apiGroup: 'policy.open-cluster-management.io',
                                kind: 'PolicySet',
                                name: '',
                            },
                        ],
                    } as IResource,
                ]
            }
        >
            <Step label="Details" id="details-step">
                {props.editMode !== EditMode.Edit && (
                    <Fragment>
                        <Sync kind="PolicySet" path="metadata.name" prefix="-placement" />
                        <Sync kind="PolicySet" path="metadata.name" prefix="-placement" />
                        <Sync kind="PolicySet" path="metadata.name" targetKind="PlacementBinding" targetPath="subjects.0.name" />
                    </Fragment>
                )}
                <Sync kind="PolicySet" path="metadata.namespace" />
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
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
                    bindingSubjectKind="PolicySet"
                    bindingSubjectApiGroup="policy.open-cluster-management.io"
                    existingPlacements={props.placements}
                    existingPlacementRules={props.placementRules}
                    defaultPlacementType="placement-rule"
                />
            </Step>
        </WizardPage>
    )
}

function PoliciesSection(props: { policies: IResource[] }) {
    const resources = useItem() as IResource[]
    const namespacedPolicies = useMemo(() => {
        if (!resources.find) return []
        const policySet = resources?.find((resource) => resource.kind === 'PolicySet')
        if (!policySet) return []
        const namespace = policySet.metadata?.namespace
        if (!namespace) return []
        return props.policies.filter((policy) => policy.metadata?.namespace === namespace)
    }, [props.policies, resources])
    return (
        <Section label="Policies" description="Select the policies you want to add to this set">
            <ItemSelector selectKey="kind" selectValue="PolicySet">
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
