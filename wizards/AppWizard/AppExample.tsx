import { useHistory } from 'react-router-dom'
import { AppWizard } from './AppWizard'

export function AppExample() {
    const history = useHistory()
    return <AppWizard onSubmit={() => Promise.resolve()} onCancel={() => history.push('./?route=wizards')} />
}
