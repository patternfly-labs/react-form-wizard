import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { InputTextDetail } from '..'
import { ClearInputButton } from '../buttons/ClearInputButton'
import { PasteInputButton } from '../buttons/PasteInputButton'
import { ShowSecretsButton } from '../buttons/ShowSecretsButton'
import { InputLabelHelp } from '../components/InputLabelHelp'
import { InputContext, InputMode } from '../contexts/InputContext'
import { InputItemContext } from '../contexts/InputItemContext'
import { lowercaseFirst } from '../lib/input-utils'

export function InputText(props: {
    id: string
    label: string
    path?: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    hidden?: (item: any) => boolean
    required?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
}) {
    const id = props.id
    const path = props.path ?? props.id
    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`

    let inputContext = useContext(InputContext)
    let item = useContext(InputItemContext)

    const [showSecrets, setShowSecrets] = useState(false)
    const [mouseOver, setMouseOver] = useState(false)

    const value = get(item, path) ?? ''

    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (inputContext.showValidation) {
        if (props.required && !value) {
            error = `${props.label} is required`
        } else if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    if (inputContext.mode === InputMode.Details) {
        return <InputTextDetail id={props.id} label={props.label} />
    }

    return (
        <FormGroup
            id={`${id}-form-group`}
            key={`${id}-form-group`}
            fieldId={id}
            label={props.label}
            isRequired={props.required}
            helperTextInvalid={error}
            validated={validated}
            helperText={props.helperText}
            labelIcon={<InputLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            onMouseOver={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
        >
            <InputGroup id={`${id}-input-group`} key={`${id}-input-group`}>
                <TextInput
                    id={id}
                    key={id}
                    placeholder={placeholder}
                    validated={validated}
                    value={value}
                    onChange={(value) => {
                        set(item, path, value)
                        inputContext.updateContext()
                    }}
                    // validated={validated}
                    isReadOnly={props.readonly}
                    type={!props.secret || showSecrets ? 'text' : 'password'}
                />
                {mouseOver && value === '' && (
                    <PasteInputButton
                        setValue={(value) => {
                            set(item, path, value)
                            inputContext.updateContext()
                        }}
                        setShowSecrets={setShowSecrets}
                    />
                )}
                {mouseOver && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton
                        onClick={() => {
                            set(item, path, '')
                            inputContext.updateContext()
                        }}
                    />
                )}
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
            </InputGroup>
        </FormGroup>
    )
}
