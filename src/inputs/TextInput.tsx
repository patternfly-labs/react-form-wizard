import { InputGroup } from '@patternfly/react-core/dist/js/components/InputGroup'
import { TextInput as PFTextInput } from '@patternfly/react-core/dist/js/components/TextInput'
import { Fragment, useState } from 'react'
import { FormWizardTextDetail } from '..'
import { ClearInputButton } from '../components/ClearInputButton'
import { PasteInputButton } from '../components/PasteInputButton'
import { ShowSecretsButton } from '../components/ShowSecretsButton'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './FormWizardInput'
import { InputLabel } from './InputLabel'

export type TextInputProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
}

export function TextInput(props: TextInputProps) {
    const { mode, value, setValue, validated, hidden, id } = useInput(props)
    const [showSecrets, setShowSecrets] = useState(false)

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        if (!value) return <Fragment />
        return <FormWizardTextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`

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
                />
                {value !== '' && props.secret && <ShowSecretsButton showSecrets={showSecrets} setShowSecrets={setShowSecrets} />}
                {value === '' && <PasteInputButton setValue={setValue} setShowSecrets={setShowSecrets} />}
                {value !== '' && !props.readonly && !props.disabled && <ClearInputButton onClick={() => setValue('')} />}
            </InputGroup>
        </InputLabel>
    )
}
