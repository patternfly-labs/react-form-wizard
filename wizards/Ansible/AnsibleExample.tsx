import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { AnsibleWizard } from './AnsibleWizard'

export function AnsibleExample() {
    const history = useHistory()
    const credentials = useMemo(() => ['my-inst-creds', 'my-up-creds'], [])
    const namespaces = useMemo(() => ['default'], [])
    return (
        <AnsibleWizard
            credentials={credentials}
            namespaces={namespaces}
            onSubmit={() => Promise.resolve()}
            onCancel={() => history.push('./?route=wizards')}
        />
    )
}
