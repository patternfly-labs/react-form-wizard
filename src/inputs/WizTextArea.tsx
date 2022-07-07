import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextArea as PFTextArea } from '@patternfly/react-core/dist/js/components/TextArea'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { WizTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, getSelectPlaceholder, useInput } from './Input'
import { WizFormGroup } from './WizFormGroup'

export type WizTextAreaProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
    canPaste?: boolean
}

export function WizTextArea(props: WizTextAreaProps) {
    const { displayMode: mode, value, disabled, setValue, validated, hidden, id } = useInput(props)

    const [showSecrets, setShowSecrets] = useState(true)

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <WizTextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = getSelectPlaceholder(props)
    const canPaste = props.canPaste !== undefined ? props.canPaste : props.secret === true

    return (
        <WizFormGroup {...props} id={id}>
            <InputGroup>
                {value && !showSecrets && props.secret ? (
                    <TextInput id={id} value={value} validated={validated} isReadOnly={true} type="password" />
                ) : (
                    <PFTextArea
                        id={id}
                        placeholder={placeholder}
                        validated={validated}
                        value={value}
                        onChange={setValue}
                        isReadOnly={props.readonly}
                        type={!props.secret || showSecrets ? 'text' : 'password'}
                        spellCheck="false"
                        resizeOrientation="vertical"
                        autoResize
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
                            setShowSecrets(false)
                        }}
                    />
                )}
            </InputGroup>
        </WizFormGroup>
    )
}
