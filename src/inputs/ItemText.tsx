import { Fragment, ReactNode } from 'react'
import { useValue } from './Input'

export function ItemText(props: { id?: string; path: string; placeholder?: ReactNode; isHorizontal?: boolean }) {
    const [value] = useValue(props, '')

    if (!value && props.placeholder) {
        return <span style={{ opacity: 0.7 }}>{props.placeholder}</span>
    }

    if (value === undefined) {
        return <Fragment />
    }

    return <Fragment>{value}</Fragment>
}
