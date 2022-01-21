import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { PolicyWizard } from './PolicyWizard'

export function PolicyExample() {
    const history = useHistory()
    const namespaces = useMemo(() => ['default'], [])
    return <PolicyWizard onSubmit={() => Promise.resolve()} onCancel={() => history.push('.')} namespaces={namespaces} />
}
