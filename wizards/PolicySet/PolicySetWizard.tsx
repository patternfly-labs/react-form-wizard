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
import { isValidKubernetesName } from '../common/validation'
import { IClusterSetBinding, PlacementSection, Sync } from '../Placement/PlacementSection'

export interface PolicySetWizardProps {
    namespaces: string[]
    policies: IResource[]
    clusterSetBindings: IClusterSetBinding[]
    title: string
    editMode?: EditMode
    onSubmit: WizardSubmit
    onCancel: WizardCancel
    resources?: IResource[]
}

export function PolicySetWizard(props: PolicySetWizardProps) {
    return (
        <WizardPage
            title={props.title}
            defaultData={
                props.resources ?? [
                    {
                        apiVersion: 'policy.open-cluster-management.io/v1',
                        kind: 'PolicySet',
                        metadata: { name: '', namespace: '' },
                        spec: { description: '', policies: [] },
                    },
                ]
            }
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
            editMode={props.editMode}
        >
            <Step label="Details" id="details-step">
                {props.editMode === EditMode.Create && (
                    <Fragment>
                        <Sync kind="PolicySet" path="metadata.name" />
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
                    clusterSetBindings={props.clusterSetBindings}
                    bindingKind="PolicySet"
                    bindingApiGroup="policy.open-cluster-management.io"
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
                    emptyMessage="No policies availble for selection. Set the namespace to be able to select policies in that namespace."
                />
            </ItemSelector>
        </Section>
    )
}
