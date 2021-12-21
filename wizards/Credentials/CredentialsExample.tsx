import { useHistory } from 'react-router-dom'
import { CredentialsWizard } from './CredentialsWizard'

export function CredentialsExample() {
    const history = useHistory()
    return <CredentialsWizard onCancel={() => history.push('.')} />
}
