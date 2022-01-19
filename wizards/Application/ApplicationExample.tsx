import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { ApplicationWizard } from './ApplicationWizard'

export function ApplicationExample() {
    const history = useHistory()
    const namespaces = useMemo(() => ['default', 'namespace-1', 'namespace-2'], [])
    const servers = useMemo(() => ['default', 'server-1', 'server-2'], [])
    const ansibleCredentials = useMemo(() => ['credential1', 'credential2'], [])
    const placements = useMemo(() => ['placement-1', 'placement-2'], [])
    return (
        <ApplicationWizard
            ansibleCredentials={ansibleCredentials}
            argoServers={servers}
            namespaces={namespaces}
            onCancel={() => history.push('.')}
            placements={placements}
        />
    )
}
