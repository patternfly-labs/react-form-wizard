import { useHistory } from 'react-router-dom'
import { onCancel, onSubmit } from '../components/utils'
import { CredentialsWizard } from './CredentialsWizard'

export function CredentialsExample() {
    const history = useHistory()
    return <CredentialsWizard onSubmit={onSubmit} onCancel={() => onCancel(history)} />
}
