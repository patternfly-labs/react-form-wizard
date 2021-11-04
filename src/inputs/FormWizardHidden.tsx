import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardHidden(props: { children: ReactNode; hidden?: (item: any) => boolean }) {
    let item = useContext(FormWizardItemContext)
    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}
