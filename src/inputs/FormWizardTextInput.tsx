import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardTextDetail } from '..'
import { ClearInputButton } from '../buttons/ClearInputButton'
import { PasteInputButton } from '../buttons/PasteInputButton'
import { ShowSecretsButton } from '../buttons/ShowSecretsButton'
import { FormWizardLabelHelp } from '../components/FormWizardLabelHelp'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'
import { lowercaseFirst } from '../lib/input-utils'

export function FormWizardTextInput(props: {
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

    let formWizardContext = useContext(FormWizardContext)
    let item = useContext(FormWizardItemContext)

    const [showSecrets, setShowSecrets] = useState(false)
    const [mouseOver, setMouseOver] = useState(false)

    const value = get(item, path) ?? ''

    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (formWizardContext.showValidation) {
        if (props.required && !value) {
            error = `${props.label} is required`
        } else if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        return <FormWizardTextDetail id={props.id} label={props.label} />
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
            labelIcon={<FormWizardLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
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
                        formWizardContext.updateContext()
                    }}
                    // validated={validated}
                    isReadOnly={props.readonly}
                    type={!props.secret || showSecrets ? 'text' : 'password'}
                />
                {mouseOver && value === '' && (
                    <PasteInputButton
                        setValue={(value) => {
                            set(item, path, value)
                            formWizardContext.updateContext()
                        }}
                        setShowSecrets={setShowSecrets}
                    />
                )}
                {mouseOver && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton
                        onClick={() => {
                            set(item, path, '')
                            formWizardContext.updateContext()
                        }}
                    />
                )}
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
            </InputGroup>
        </FormGroup>
    )
}
