import { DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Stack } from '@patternfly/react-core'
import { Fragment, ReactNode } from 'react'
import { Indented } from '../components/Indented'
import { useInputHidden, useValue } from './Input'

export function TextDetail(props: {
    id?: string
    label?: string
    path: string
    placeholder?: ReactNode
    secret?: boolean
    hidden?: (item: any) => boolean
    children?: ReactNode
}) {
    // TODO - Support hiding sercets
    // const [showSecrets, setShowSecrets] = useState(false)

    const [value] = useValue(props, '')
    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />

    if (!props.label) {
        if (!value && props.placeholder) {
            return <span style={{ opacity: 0.7 }}>{props.placeholder}</span>
        }

        if (value === undefined) {
            return <Fragment />
        }

        return <Fragment>{value}</Fragment>
    }

    if (value === undefined) {
        return <Fragment />
    }

    return (
        <Stack>
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={props.id}>{value}</DescriptionListDescription>
            </DescriptionListGroup>
            {props.children && <Indented>{props.children}</Indented>}
        </Stack>
    )
}
