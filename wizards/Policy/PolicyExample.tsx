import { useMemo } from 'react'
import { useHistory } from 'react-router'
import { EditMode } from '../../src'
import { onCancel, onSubmit } from '../common/utils'
import { PolicyWizard } from './PolicyWizard'

export function PolicyExample() {
    const history = useHistory()
    const namespaces = useMemo(() => ['default'], [])
    return <PolicyWizard onSubmit={onSubmit} onCancel={() => onCancel(history)} namespaces={namespaces} editMode={EditMode.Create} />
}
