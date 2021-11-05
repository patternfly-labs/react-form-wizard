import { DescriptionList } from '@patternfly/react-core'
import { ReactNode, useContext } from 'react'
import { FormWizardContext, InputMode } from './contexts/FormWizardContext'

export function FormWizardDetailsView(props: { children: ReactNode }) {
    const formWizardContext = useContext(FormWizardContext)
    return (
        <FormWizardContext.Provider value={{ ...formWizardContext, ...{ mode: InputMode.Details } }}>
            <DescriptionList isHorizontal>{props.children}</DescriptionList>
        </FormWizardContext.Provider>
    )
}
