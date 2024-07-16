import { InputGroup, TextArea as PFTextArea, TextAreaProps, TextInput } from '@patternfly/react-core'
import { Fragment, useCallback, useState } from 'react'
import { WizTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { getEnterPlaceholder, InputCommonProps, useInput } from './Input'
import { WizFormGroup } from './WizFormGroup'

export type WizTextAreaProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
    canPaste?: boolean
}

export function WizTextArea(props: WizTextAreaProps) {
    const { displayMode: mode, value, disabled, setValue, validated, hidden, id } = useInput(props)

    // Hide initially if a value is set
    const [showSecrets, setShowSecrets] = useState(!value)

    const onChange = useCallback<NonNullable<TextAreaProps['onChange']>>((_event, value) => setValue(value), [setValue])

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <WizTextDetail id={id} path={props.path} label={props.label} secret={props.secret} />
    }

    const placeholder = getEnterPlaceholder(props)
    const canPaste = props.canPaste !== undefined ? props.canPaste : props.secret === true

    return (
        <WizFormGroup {...props} id={id} key={id}>
            <InputGroup>
                {value && !showSecrets && props.secret ? (
                    <TextInput id={id} value={value} validated={validated} type="password" readOnlyVariant="default" />
                ) : (
                    <PFTextArea
                        id={id}
                        placeholder={placeholder}
                        validated={validated}
                        value={value}
                        onChange={onChange}
                        type={!props.secret || showSecrets ? 'text' : 'password'}
                        spellCheck="false"
                        resizeOrientation="vertical"
                        autoResize={!!value} // Only enable after text has been entered; bug with initial size calculation
                        readOnlyVariant={props.readonly ? 'default' : undefined}
                    />
                )}
                {!disabled && value !== '' && props.secret && (
                    <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />
                )}
                {canPaste && !disabled && value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {canPaste && !disabled && value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton
                        onClick={() => {
                            setValue('')
                            setShowSecrets(true)
                        }}
                    />
                )}
            </InputGroup>
        </WizFormGroup>
    )
}
