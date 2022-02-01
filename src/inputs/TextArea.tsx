import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextArea as PFTextArea } from '@patternfly/react-core/dist/js/components/TextArea'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { TextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'

export type TextAreaProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
}

export function TextArea(props: TextAreaProps) {
    const { displayMode: mode, value, setValue, validated, hidden, id } = useInput(props)

    const [showSecrets, setShowSecrets] = useState(true)

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <TextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`

    return (
        <InputLabel {...props} id={id}>
            <InputGroup>
                {value && !showSecrets && props.secret ? (
                    <TextInput id={id} value={value} validated={validated} isReadOnly={true} type={'password'} />
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
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
                {value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {value !== '' && !props.readonly && !props.disabled && (
                    <ClearInputButton
                        onClick={() => {
                            setValue('')
                            setShowSecrets(false)
                        }}
                    />
                )}
            </InputGroup>
        </InputLabel>
    )
}
