import { DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Stack } from '@patternfly/react-core'
import { Fragment, ReactNode } from 'react'
import { FormWizardIndented } from '../components/FormWizardIndented'
import { useInputHidden, useInputValue } from './FormWizardInput'

export function FormWizardTextDetail(props: {
    id: string
    label?: string
    path?: string
    placeholder?: string
    secret?: boolean
    hidden?: (item: any) => boolean
    children?: ReactNode
}) {
    // TODO - Support hiding sercets
    // const [showSecrets, setShowSecrets] = useState(false)

    const value = useInputValue(props, '')
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
            {props.children && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Stack>
    )
}
