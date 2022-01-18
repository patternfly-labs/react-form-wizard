import { Fragment, ReactNode } from 'react'

export function Step(props: { label: string; children?: ReactNode }) {
    return <Fragment>{props.children}</Fragment>
}
