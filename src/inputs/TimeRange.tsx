import { DescriptionListDescription, Split, TimePicker } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { CheckIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { DisplayMode, useDisplayMode } from '../contexts/DisplayModeContext'
import { useID } from './Input'

export function TimeRange(props: {
    id?: string
    label: string
    description?: string
    path: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    hidden?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
    children?: ReactNode
}) {
    const id = useID(props)
    const path = props.path ?? id

    const { update } = useData()
    const mode = useDisplayMode()
    const item = useContext(ItemContext)

    const value = get(item, path)

    const showValidation = false
    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (showValidation) {
        if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    if (props.hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return (
            <Split hasGutter>
                <CheckIcon />
                <DescriptionListDescription>{props.label}</DescriptionListDescription>
            </Split>
        )
    }

    return (
        <Fragment>
            <FormGroup
                id={`${id}-form-group`}
                fieldId={id}
                isInline
                label={props.label}
                helperText={props.helperText}
                helperTextInvalid={error}
                validated={validated}
                isRequired
            >
                <TimePicker
                    id={`${id}-time-picker`}
                    key={id}
                    onChange={(value) => {
                        set(item, path, value)
                        update()
                    }}
                    label={props.label}
                    value={value}
                />
            </FormGroup>
        </Fragment>
    )
}
