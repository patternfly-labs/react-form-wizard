import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useContext, useState } from 'react'
import { FormWizardTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { InputCommonProps, lowercaseFirst, useInputHidden, useInputValidation, useInputValue } from './FormWizardInput'
import { FormWizardInputLabel } from './FormWizardInputLabel'

export type FormWizardTextInputProps = InputCommonProps<string> & {
    placeholder?: string
    secret?: boolean
}

export function FormWizardTextInput(props: FormWizardTextInputProps) {
    const formWizardContext = useContext(FormWizardContext)

    const [value, setValue] = useInputValue(props, '')
    const { validated } = useInputValidation(props)

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`
    const [showSecrets, setShowSecrets] = useState(false)

    const hidden = useInputHidden(props)
    if (hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        return <FormWizardTextDetail id={props.id} path={props.path} label={props.label} />
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
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
                {value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {value !== '' && !props.readonly && !props.disabled && <ClearInputButton onClick={() => setValue('')} />}
            </InputGroup>
        </FormWizardInputLabel>
    )
}
