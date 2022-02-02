import { useHistory } from 'react-router-dom'
import { RosaWizard } from './RosaWizard'

export function RosaExample() {
    const history = useHistory()
    return <RosaWizard onSubmit={() => Promise.resolve()} onCancel={() => history.push('./?route=wizards')} />
}
