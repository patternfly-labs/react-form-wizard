import { useHistory } from 'react-router-dom'
import { onCancel, onSubmit } from '../common/utils'
import { PolicySetWizard } from './PolicySetWizard'

export function PolicySetExample() {
    const history = useHistory()
    return (
        <PolicySetWizard
            namespaces={['default']}
            policies={[
                { kind: 'PolicySet', metadata: { name: 'policy-1', namespace: 'default' } },
                { kind: 'PolicySet', metadata: { name: 'policy-2', namespace: 'default' } },
                { kind: 'PolicySet', metadata: { name: 'policy-3', namespace: 'default' } },
                { kind: 'PolicySet', metadata: { name: 'policy-4', namespace: 'default' } },
            ]}
            clusterSets={[
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-1', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-2', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-3', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-4', namespace: 'default' } },
            ]}
            title="Create policy set"
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
            // editMode={EditMode.Edit}
        />
    )
}
