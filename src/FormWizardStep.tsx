import { Form } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardContext, InputMode } from './contexts/FormWizardContext'

export function FormWizardStep(props: { label: string; children: ReactNode; hidden?: (item: any) => boolean }) {
    let formWizardContext = useContext(FormWizardContext)

    switch (formWizardContext.mode) {
        case InputMode.Wizard:
            return <Form>{props.children}</Form>
        default:
            return <Fragment>{props.children}</Fragment>
    }
}
