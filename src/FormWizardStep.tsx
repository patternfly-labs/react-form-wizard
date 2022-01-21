import { Form } from '@patternfly/react-core'
import { Fragment, ReactNode } from 'react'
import { Mode, useMode } from './contexts/ModeContext'

export function FormWizardStep(props: { label: string; children: ReactNode; hidden?: (item: any) => boolean }) {
    const mode = useMode()
    switch (mode) {
        case Mode.Wizard:
            return <Form key={props.label}>{props.children}</Form>
        default:
            return <Fragment key={props.label}>{props.children}</Fragment>
    }
}
