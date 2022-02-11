import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { clusterSetBindings, placementRules, placements, policies } from '../common/test-data'
import { onCancel, onSubmit } from '../common/utils'
import { PolicyWizard } from './PolicyWizard'

export function PolicyExample() {
    const history = useHistory()
    const namespaces = useMemo(() => ['default'], [])
    return (
        <PolicyWizard
            title="Create policy"
            namespaces={namespaces}
            policies={policies}
            placements={placements}
            placementRules={placementRules}
            clusterSetBindings={clusterSetBindings}
            onSubmit={onSubmit}
            onCancel={() => onCancel(history)}
        />
    )
}
