import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { onCancel, onSubmit } from '../components/utils'
import { PolicyWizard } from './PolicyWizard'

export function PolicyExample() {
    const history = useHistory()
    const namespaces = useMemo(() => ['default'], [])
    return <PolicyWizard onSubmit={onSubmit} onCancel={() => onCancel(history)} namespaces={namespaces} />
}
