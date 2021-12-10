import { useCallback } from 'react'
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
    return <PolicyWizard onSubmit={onSubmit} />
}
