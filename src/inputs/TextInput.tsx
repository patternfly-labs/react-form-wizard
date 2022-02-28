import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput as PFTextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { TextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'

export type TextInputProps = InputCommonProps<string> & {
    placeholder?: string
    secret?: boolean
    disablePaste?: boolean
}

export function TextInput(props: TextInputProps) {
    const { displayMode: mode, value, setValue, disabled, validated, hidden, id } = useInput(props)
    const [showSecrets, setShowSecrets] = useState(false)

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <TextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = props.placeholder ?? props.label !== undefined ? `Enter the ${lowercaseFirst(props.label ?? '')}` : ''

    return (
        <InputLabel {...props} id={id}>
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
                {!props.disablePaste && !disabled && value === '' && (
                    <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />
                )}
                {!props.disablePaste && !disabled && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton onClick={() => setValue('')} />
                )}
            </InputGroup>
        </InputLabel>
    )
}
