import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput as PFTextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { WizTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, getEnterPlaceholder, useInput } from './Input'
import { WizFormGroup } from './WizFormGroup'

export type WizTextInputProps = InputCommonProps<string> & {
    placeholder?: string
    secret?: boolean
    canPaste?: boolean
}

export function WizTextInput(props: WizTextInputProps) {
    const { displayMode: mode, value, setValue, disabled, validated, hidden, id } = useInput(props)
    const [showSecrets, setShowSecrets] = useState(false)

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <WizTextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = getEnterPlaceholder(props)
    const canPaste = props.canPaste !== undefined ? props.canPaste : props.secret === true

    if (!props.label) {
        return (
            <InputGroup>
                <PFTextInput
                    id={id}
                    placeholder={placeholder}
                    validated={validated}
                    value={value}
                    onChange={setValue}
                    isReadOnly={props.readonly}
                    type={!props.secret || showSecrets ? 'text' : 'password'}
                    isDisabled={disabled}
                />
                {!disabled && value !== '' && props.secret && (
                    <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />
                )}
                {canPaste && !disabled && value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {canPaste && !disabled && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton onClick={() => setValue('')} />
                )}
            </InputGroup>
        )
    }

    return (
        <WizFormGroup {...props} id={id}>
            <InputGroup>
                <PFTextInput
                    id={id}
                    placeholder={placeholder}
                    validated={validated}
                    value={value}
                    onChange={setValue}
                    isReadOnly={props.readonly}
                    type={!props.secret || showSecrets ? 'text' : 'password'}
                    isDisabled={disabled}
                />
                {!disabled && value !== '' && props.secret && (
                    <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />
                )}
                {canPaste && !disabled && value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {canPaste && !disabled && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton onClick={() => setValue('')} />
                )}
            </InputGroup>
        </WizFormGroup>
    )
}
