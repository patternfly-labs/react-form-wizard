import { ItemSelector, Section, Select, Step, TableSelect, TextArea, TextInput, WizardCancel, WizardPage, WizardSubmit } from '../../src'
import { isValidKubernetesName } from '../components/validation'
import { PlacementSection, Sync } from '../Placement/PlacementWizard'

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
            <Step label="Details" id="details-step">
                <Sync kind="PolicySet" path="metadata.name" targetKind="PlacementBinding" targetPath="subjects.0.name" />
                <Sync kind="PolicySet" path="metadata.namespace" />
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
                        <TextInput label="Name" path="metadata.name" id="name" required validation={isValidKubernetesName} />
                        <TextArea label="Description" path="spec.description" />
                        <Select label="Namespace" path="metadata.namespace" id="namespace" required options={props.namespaces} />
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
                            items={props.policies}
                            itemToValue={(policy: IResource) => policy.metadata.name}
                            valueMatchesItem={(value: unknown, policy: IResource) => value === policy.metadata.name}
                        />
                    </ItemSelector>
                </Section>
            </Step>
            <Step label="Placement" id="placement-step">
                <PlacementSection
                    clusterSets={props.clusterSets}
                    bindingKind="PolicySet"
                    bindingApiGroup="policy.open-cluster-management.io"
                />
            </Step>
        </WizardPage>
    )
}
