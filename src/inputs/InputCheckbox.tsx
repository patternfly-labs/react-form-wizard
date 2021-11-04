import { Checkbox, DescriptionListDescription, Split } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { CheckIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { InputIndented } from '../components/InputIndented'
import { InputLabelHelp } from '../components/InputLabelHelp'
import { InputContext, InputMode } from '../contexts/InputContext'
import { InputItemContext } from '../contexts/InputItemContext'

export function InputCheckbox(props: {
    id: string
    label: string
    description?: string
    path?: string
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
    const id = props.id
    const path = props.path ?? id

    let inputContext = useContext(InputContext)
    let item = useContext(InputItemContext)

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

    if (inputContext.mode === InputMode.Details) {
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
                id={`${props.id}-form-group`}
                fieldId={id}
                // label={props.label}
                helperTextInvalid={error}
                validated={validated}
                helperText={props.helperText}
                labelIcon={<InputLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            >
                <Checkbox
                    id={id ?? props.label}
                    isChecked={value}
                    onChange={(value) => {
                        set(item, path, value)
                        inputContext.updateContext()
                    }}
                    label={props.label}
                    value={value}
                />
            </FormGroup>
            {value && <InputIndented>{props.children}</InputIndented>}
        </Fragment>
    )
}
