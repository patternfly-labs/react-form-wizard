import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useContext, useState } from 'react'
import { FormWizardTextDetail } from '..'
import { ClearInputButton } from '../buttons/ClearInputButton'
import { PasteInputButton } from '../buttons/PasteInputButton'
import { ShowSecretsButton } from '../buttons/ShowSecretsButton'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { InputCommonProps, lowercaseFirst, useInputHidden, useInputValidation, useInputValue } from './FormWizardInput'
import { FormWizardInputLabel } from './FormWizardInputLabel'

export type FormWizardTextInputProps = InputCommonProps<string> & {
    placeholder?: string
    secret?: boolean
}

export function FormWizardTextInput(props: FormWizardTextInputProps) {
    const formWizardContext = useContext(FormWizardContext)

    const [value, setValue] = useInputValue(props)
    const { validated } = useInputValidation(props)

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`
    const [showSecrets, setShowSecrets] = useState(false)

    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        return <FormWizardTextDetail id={props.id} label={props.label} />
    }

    return (
        <FormWizardInputLabel {...props}>
            <InputGroup id={`${props.id}-input-group`} key={`${props.id}-input-group`}>
                <TextInput
                    id={props.id}
                    placeholder={placeholder}
                    validated={validated}
                    value={value}
                    onChange={setValue}
                    isReadOnly={props.readonly}
                    type={!props.secret || showSecrets ? 'text' : 'password'}
                />
                {value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {value !== '' && !props.readonly && !props.disabled && <ClearInputButton onClick={() => setValue('')} />}
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
            </InputGroup>
        </FormWizardInputLabel>
    )
}
