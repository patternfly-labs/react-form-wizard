import { Fragment, ReactNode } from 'react'
import { DisplayMode, useDisplayMode } from '../contexts/DisplayModeContext'
import { useInputHidden } from './Input'

export function Hidden(props: { children: ReactNode; hidden?: (item: any) => boolean }) {
    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}

export function DetailsHidden(props: { children: ReactNode }) {
    const displayMode = useDisplayMode()
    if (displayMode === DisplayMode.Details) return <Fragment />
    return <Fragment>{props.children}</Fragment>
}
