import { useHistory } from 'react-router-dom'
import { PlacementWizard } from './PlacementWizard'

export function PlacementExample() {
    const history = useHistory()
    return (
        <PlacementWizard
            clusterSets={[
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-1', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-2', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-3', namespace: 'default' } },
                { kind: 'ClusterSet', metadata: { name: 'cluster-set-4', namespace: 'default' } },
            ]}
            onSubmit={() => Promise.resolve()}
            onCancel={() => history.push('./?route=wizards')}
        />
    )
}
