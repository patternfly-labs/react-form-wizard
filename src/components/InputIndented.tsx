import { Stack } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { InputItemContext } from '../contexts/InputItemContext'

export function InputIndented(props: { children?: ReactNode; hidden?: (item: any) => boolean }) {
    let item = useContext(InputItemContext)

    if (!props.children) return <Fragment />

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    return (
        <Stack hasGutter style={{ paddingLeft: 48 }}>
            {props.children}
        </Stack>
    )
}
