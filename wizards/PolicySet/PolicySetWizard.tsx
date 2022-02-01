import { Fragment, useMemo } from 'react'
import { ItemSelector, Section, Select, Step, TableSelect, TextArea, TextInput, WizardCancel, WizardPage, WizardSubmit } from '../../src'
import { useItem } from '../../src/contexts/ItemContext'
import { PlacementStep } from '../Placement/PlacementWizard'

interface IResource {
    kind: string
    metadata: { name: string; namespace: string }
}

export interface PolicySetWizardProps {
    namespaces: string[]
    policies: IResource[]
    clusterSets: IResource[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
}

export function PolicySetWizard(props: PolicySetWizardProps) {
    return (
        <WizardPage
            title="Create policy set"
            defaultData={[
                {
                    apiVersion: 'policy.open-cluster-management.io/v1',
                    kind: 'PolicySet',
                    metadata: { name: '', namespace: '' },
                    spec: { description: '', policies: [] },
                },
            ]}
            onSubmit={props.onSubmit}
            onCancel={props.onCancel}
        >
            <PolicySetWizardSteps {...props} />
        </WizardPage>
    )
}

export function PolicySetWizardSteps(props: PolicySetWizardProps) {
    const resources = useItem() as IResource[]
    const namespacedPolicies = useMemo(() => {
        const policySet = resources.find((resource: IResource) => resource.kind === 'PolicySet')
        if (!policySet) return []
        return props.policies.filter((policy) => policy.metadata.namespace === policySet.metadata.namespace)
    }, [props.policies, resources])
    return (
        <Fragment>
            <Step label="Details" id="details-step">
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
                        <TextInput label="Name" path="metadata.name" required />
                        <TextArea label="Description" path="spec.description" />
                        <Select label="Namespace" path="metadata.namespace" required options={props.namespaces} />
                    </ItemSelector>
                </Section>
            </Step>

            <Step label="Policies" id="policies-step">
                <Section label="Policies" description="Select the policies you want to add to this set">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
                        <TableSelect
                            id="policies"
                            path="spec.policies"
                            label=""
                            columns={[{ name: 'Name', cellFn: (policy: IResource) => policy.metadata.name }]}
                            items={namespacedPolicies}
                            itemToValue={(policy: IResource) => policy.metadata.name}
                            valueMatchesItem={(value: unknown, policy: IResource) => value === policy.metadata.name}
                        />
                    </ItemSelector>
                </Section>
            </Step>

            <Step label="Placement" id="placement-step">
                <PlacementStep namespaces={props.namespaces} clusterSets={props.clusterSets} />
            </Step>
        </Fragment>
    )
}
