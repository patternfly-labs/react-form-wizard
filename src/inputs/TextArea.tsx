import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextArea as PFTextArea } from '@patternfly/react-core/dist/js/components/TextArea'
import { TextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { FormWizardTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './FormWizardInput'
import { InputLabel } from './FormWizardInputLabel'

export type TextAreaProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
}

export function TextArea(props: TextAreaProps) {
    const { mode, value, setValue, validated, hidden, id } = useInput(props)

    const [showSecrets, setShowSecrets] = useState(true)

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        return <FormWizardTextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`

    return (
        <InputLabel {...props} id={id}>
            <InputGroup>
                {value && !showSecrets && props.secret ? (
                    <TextInput id={props.id} value={value} validated={validated} isReadOnly={true} type={'password'} />
                ) : (
                    <PFTextArea
                        id={props.id}
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

export const FormWizardTextArea = TextArea
