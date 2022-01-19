import { Fragment, ReactNode } from 'react'
import { HiddenFn } from './inputs/FormWizardInput'

export function Step(props: { label: string; children?: ReactNode; id?: string; hidden?: HiddenFn }) {
    return <Fragment>{props.children}</Fragment>
}
