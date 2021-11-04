import { Form } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { InputContext, InputMode } from './contexts/InputContext'

export function InputStep(props: { label: string; children: ReactNode; hidden?: (item: any) => boolean }) {
    let inputContext = useContext(InputContext)

    switch (inputContext.mode) {
        case InputMode.Wizard:
            return <Form>{props.children}</Form>
        default:
            return <Fragment>{props.children}</Fragment>
    }
}
