import { Fragment, ReactNode } from 'react'

export function Step(props: { label: string; children?: ReactNode; id?: string }) {
    return <Fragment>{props.children}</Fragment>
}
