import {
    Chip,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    LabelGroup,
    Select,
    SelectOption,
    SelectVariant,
} from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { InputLabelHelp } from '../components/InputLabelHelp'
import { InputContext, InputMode } from '../contexts/InputContext'
import { InputItemContext } from '../contexts/InputItemContext'

export function InputLabels(props: {
    id: string
    label: string
    path?: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
    options?: {
        id: string
        label: string
        value: string
    }[]
    hidden?: (item: any) => boolean
}) {
    const id = props.id
    const path = props.path ?? id

    let inputContext = useContext(InputContext)
    let item = useContext(InputItemContext)

    const [open, setOpen] = useState(false)

    const value = get(item, path)
    let selections: string[] = []
    if (value)
        selections = Object.keys(value).map((key) => {
            const v = value[key]
            if (v) key += '=' + v
            return key
        })

    const showValidation = false
    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (showValidation) {
        if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    if (inputContext.mode === InputMode.Details) {
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>
                    <LabelGroup>
                        {selections.map((label) => (
                            <Chip isReadOnly>{label}</Chip>
                        ))}
                    </LabelGroup>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <FormGroup
            id={`${id}-form-group`}
            fieldId={id}
            label={props.label}
            isRequired={props.required}
            helperTextInvalid={error}
            validated={validated}
            helperText={props.helperText}
            labelIcon={<InputLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
        >
            <Select
                variant={SelectVariant.typeaheadMulti}
                // typeAheadAriaLabel="Select a state"
                isOpen={open}
                onToggle={setOpen}
                onSelect={(event) => {
                    event.preventDefault()
                }}
                onClear={
                    props.required
                        ? undefined
                        : () => {
                              set(item, path, '', { preservePaths: false })
                              inputContext.updateContext()
                          }
                }
                selections={selections}
                // aria-labelledby={titleId}
                placeholderText={selections.length > 0 ? undefined : props.placeholder}
                isCreatable
                // isCreatable={isCreatable}
                onCreateOption={(label) => {
                    const parts = label.split('=')
                    const key = parts[0]
                    let value = ''
                    if (parts.length > 1) {
                        value = parts.slice(1).join('=')
                    }
                    set(item, path + '.' + key, value)
                    inputContext.updateContext()
                }}
            >
                {props.options?.map((option) => {
                    return (
                        <SelectOption
                            // isDisabled={option.disabled}
                            key={option.id}
                            value={option.value}
                            // {...(option.description && { description: option.description })}
                        >
                            {option.label}
                        </SelectOption>
                    )
                })}
            </Select>
        </FormGroup>
    )
}
