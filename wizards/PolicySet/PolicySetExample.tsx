import { useHistory } from 'react-router-dom'
import { PolicySetWizard } from './PolicySetWizard'

export function PolicySetExample() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={['default']}
            policies={[
                { metadata: { name: 'policy-1', namespace: 'default' } },
                { metadata: { name: 'policy-2', namespace: 'default' } },
                { metadata: { name: 'policy-3', namespace: 'default' } },
                { metadata: { name: 'policy-4', namespace: 'default' } },
            ]}
            clusterSets={[
                { metadata: { name: 'cluster-set-1', namespace: 'default' } },
                { metadata: { name: 'cluster-set-2', namespace: 'default' } },
                { metadata: { name: 'cluster-set-3', namespace: 'default' } },
                { metadata: { name: 'cluster-set-4', namespace: 'default' } },
            ]}
            onSubmit={() => Promise.resolve()}
            onCancel={() => history.push('.')}
        />
    )
}
