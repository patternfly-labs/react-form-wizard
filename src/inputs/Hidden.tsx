import { Fragment, ReactNode } from 'react'
import { useInputHidden } from './Input'

export function Hidden(props: { children: ReactNode; hidden?: (item: any) => boolean }) {
    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}
