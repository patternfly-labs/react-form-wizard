import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import { RouteE } from '../Routes'
import { PolicyWizard } from './PolicyWizard'

export function PolicyExample() {
    const history = useHistory()
    const onSubmit = useCallback(
        (data: object) => {
            sessionStorage.setItem('results', JSON.stringify(data))
            history.push(RouteE.Results)
            return Promise.resolve()
        },
        [history]
    )
    const namespaces = useMemo(() => ['default'], [])
    return <PolicyWizard onSubmit={onSubmit} namespaces={namespaces} />
}
