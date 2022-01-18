import { Stack } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { ItemContext } from '../contexts/ItemContext'

export function FormWizardIndented(props: { children?: ReactNode; hidden?: (item: any) => boolean }) {
    const item = useContext(ItemContext)

    if (!props.children) return <Fragment />

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    return (
        <Stack hasGutter style={{ paddingLeft: 24 }}>
            {props.children}
        </Stack>
    )
}
