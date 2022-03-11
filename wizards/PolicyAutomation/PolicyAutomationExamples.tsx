import { useHistory } from 'react-router-dom'
import { Catalog } from '../Catalog'
import { IPolicyAutomation, PolicyAutomationType } from '../common/resources/IPolicyAutomation'
import { onSubmit } from '../common/utils'
import { RouteE } from '../Routes'
import { PolicyAutomationWizard } from './PolicyAutomationWizard'

export function onCancel(history: { push: (location: string) => void }) {
    history.push(`./${RouteE.Wizards}`)
}

export function PolicyAutomationExamples() {
    const history = useHistory()
    return (
        <Catalog
            title="Policy Automation Examples"
            breadcrumbs={[{ label: 'Example Wizards', to: RouteE.Wizards }, { label: 'Policy Automation Examples' }]}
            cards={[
                {
                    title: 'Create policy automation',
                    descriptions: ['Create a new policy automation.'],
                    onClick: () => history.push(RouteE.CreatePolicyAutomation),
                },
            ]}
        />
    )
}

export function CreatePolicyAutomation() {
    const history = useHistory()
    return (
        <PolicyAutomationWizard
            breadcrumb={[
                { label: 'Example Wizards', to: RouteE.Wizards },
                { label: 'Policy AutomationExamples', to: RouteE.PolicySet },
                { label: 'Create policy automation' },
            ]}
            title="Create policy automation"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            policy={{
                metadata: { name: 'my-policy', namespace: 'my-namespace' },
            }}
            credentials={[
                {
                    metadata: {
                        name: 'my-ansible-creds',
                        namespace: 'my-namespace',
                        labels: {
                            'cluster.open-cluster-management.io/type': 'ans',
                        },
                    },
                },
                {
                    metadata: {
                        name: 'my-bad-ansible-creds',
                        namespace: 'my-namespace',
                        labels: {
                            'cluster.open-cluster-management.io/type': 'ans',
                        },
                    },
                },
            ]}
            resource={
                {
                    ...PolicyAutomationType,
                    metadata: { name: 'my-policy-policy-automation', namespace: 'my-namespace' },
                    spec: {
                        policyRef: 'my-policy',
                        mode: 'once',
                        automationDef: { name: '', secret: '', type: 'AnsibleJob' },
                    },
                } as IPolicyAutomation
            }
            getAnsibleJobsCallback={async (credential) => {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                if (credential.metadata?.name === 'my-bad-ansible-creds') {
                    return Promise.reject(new Error('Bad credentials'))
                } else {
                    return Promise.resolve(['job1', 'job2'])
                }
            }}
        />
    )
}
