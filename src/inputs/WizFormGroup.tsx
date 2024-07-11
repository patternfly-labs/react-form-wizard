import { ReactNode } from 'react'
import { LabelHelp } from '../components/LabelHelp'
import { InputCommonProps, useID, useInputValidation } from './Input'
import { FormGroup, FormHelperText, HelperText, HelperTextItem } from '@patternfly/react-core'

type WizFormGroupProps = InputCommonProps & {
    children: ReactNode
    helperTextNode?: ReactNode
}

export function WizFormGroup(props: WizFormGroupProps) {
    const { validated, error } = useInputValidation(props)
    const { helperTextNode } = props
    const id = useID(props)
    const showHelperText = (validated === 'error' && error) || (validated !== 'error' && helperTextNode)
    const helperText = validated === 'error' ? error : helperTextNode
    return (
        <FormGroup
            id={`${id}-form-group`}
            key={`${id}-form-group`}
            fieldId={id}
            label={props.label}
            isRequired={props.required}
            labelIcon={<LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
        >
            {props.children}
            {showHelperText && (
                <FormHelperText>
                    <HelperText>
                        <HelperTextItem variant={validated}>{helperText}</HelperTextItem>
                    </HelperText>
                </FormHelperText>
            )}
        </FormGroup>
    )
}
