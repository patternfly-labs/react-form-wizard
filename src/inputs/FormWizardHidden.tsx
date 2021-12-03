import { Fragment, ReactNode } from 'react'
import { useInputHidden } from './FormWizardInput'

export function FormWizardHidden(props: { children: ReactNode; hidden?: (item: any) => boolean }) {
    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}
