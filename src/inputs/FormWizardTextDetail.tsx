import { DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Stack } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import { FormWizardIndented } from '../components/FormWizardIndented'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardTextDetail(props: {
    id: string
    label?: string
    path?: string
    placeholder?: string
    secret?: boolean
    hidden?: (item: any) => boolean
    children?: ReactNode
}) {
    const id = props.id
    const path = props.path ?? props.id

    const item = useContext(FormWizardItemContext)

    // TODO - Support hiding sercets
    // const [showSecrets, setShowSecrets] = useState(false)

    const value = get(item, path)

    const hidden = props.hidden ? props.hidden(item) : false
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
            <DescriptionListGroup id={id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>{value}</DescriptionListDescription>
            </DescriptionListGroup>
            {props.children && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Stack>
    )
}
