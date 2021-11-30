import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import { RouteE } from '../Routes'
import { AnsibleForm } from './AnsibleForm'

export function AnsibleExample() {
    const history = useHistory()
    const onSubmit = useCallback(
        (data: object) => {
            sessionStorage.setItem('results', JSON.stringify(data))
            history.push(RouteE.Results)
            return Promise.resolve()
        },
        [history]
    )
    const credentials = useMemo(() => ['my-ansible-creds'], [])
    return <AnsibleForm onSubmit={onSubmit} credentials={credentials} />
}
