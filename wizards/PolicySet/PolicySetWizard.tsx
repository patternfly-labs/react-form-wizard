import { ItemSelector, Multiselect, Section, Select, Step, TextArea, TextInput, WizardCancel, WizardPage, WizardSubmit } from '../../src'
import { PlacementStep } from '../Placement/PlacementWizard'

interface IResource {
    metadata: { name: string; namespace: string }
}

export function PolicySetWizard(props: {
    namespaces: string[]
    policies: IResource[]
    clusterSets: IResource[]
    onSubmit: WizardSubmit
    onCancel: WizardCancel
}) {
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
                <Section label="Details">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
                        <TextInput label="Name" path="metadata.name" required />
                        <TextArea label="Description" path="spec.description" />
                        <Select label="Namespace" path="metadata.namespace" required options={props.namespaces} />
                    </ItemSelector>
                </Section>
            </Step>

            <Step label="Policies" id="policies-step">
                <Section label="Policies">
                    <ItemSelector selectKey="kind" selectValue="PolicySet">
                        <Multiselect
                            label="Policies"
                            path="spec.policies"
                            required
                            options={props.policies.map((policy) => policy.metadata.name)}
                        />
                    </ItemSelector>
                </Section>
            </Step>

            <Step label="Placement" id="placement-step">
                <PlacementStep namespaces={props.namespaces} clusterSets={props.clusterSets} />
            </Step>
        </WizardPage>
    )
}
