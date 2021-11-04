import { Fragment, ReactNode, useContext } from 'react'
import { InputItemContext } from '../contexts/InputItemContext'

export function InputHidden(props: { children: ReactNode; hidden?: (item: any) => boolean }) {
    let item = useContext(InputItemContext)
    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}
