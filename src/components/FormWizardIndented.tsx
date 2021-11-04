import { Stack } from '@patternfly/react-core'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardIndented(props: { children?: ReactNode; hidden?: (item: any) => boolean }) {
    let item = useContext(FormWizardItemContext)

    if (!props.children) return <Fragment />

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    return (
        <Stack hasGutter style={{ paddingLeft: 48 }}>
            {props.children}
        </Stack>
    )
}
