import { useHistory } from 'react-router-dom'
import { onCancel, onSubmit } from '../common/utils'
import { PolicySetWizard } from './PolicySetWizard'

export function PolicySetExample() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={['default', 'namespace-1', 'namespace-2']}
            policies={[
                { kind: 'PolicySet', metadata: { name: 'policy-1', namespace: 'default' } },
                { kind: 'PolicySet', metadata: { name: 'policy-2', namespace: 'default' } },
                { kind: 'PolicySet', metadata: { name: 'policy-3', namespace: 'namespace-1' } },
                { kind: 'PolicySet', metadata: { name: 'policy-4', namespace: 'namespace-1' } },
            ]}
            clusterSetBindings={[
                {
                    kind: 'ManagedClusterSetBinding',
                    metadata: { name: 'cluster-set-binding-1', namespace: 'default' },
                    spec: { clusterSet: 'cluster-set-1' },
                },
                {
                    kind: 'ManagedClusterSetBinding',
                    metadata: { name: 'cluster-set-binding-2', namespace: 'default' },
                    spec: { clusterSet: 'cluster-set-2' },
                },
                {
                    kind: 'ManagedClusterSetBinding',
                    metadata: { name: 'cluster-set-binding-3', namespace: 'namespace-1' },
                    spec: { clusterSet: 'cluster-set-3' },
                },
                {
                    kind: 'ManagedClusterSetBinding',
                    metadata: { name: 'cluster-set-binding-4', namespace: 'namespace-1' },
                    spec: { clusterSet: 'cluster-set-4' },
                },
            ]}
            title="Create policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            // editMode={EditMode.Edit}
        />
    )
}
