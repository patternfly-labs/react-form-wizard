import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import { RouteE } from '../Routes'
import { AnsibleWizard } from './AnsibleWizard'

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
    const namespaces = useMemo(() => ['default'], [])
    return <AnsibleWizard onSubmit={onSubmit} credentials={credentials} namespaces={namespaces} />
}
