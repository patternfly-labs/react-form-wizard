import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { ReactNode } from 'react'
import { FormWizardLabelHelp } from '../components/FormWizardLabelHelp'
import { InputCommonProps, useInputValidation } from './FormWizardInput'

export type FormWizardInputLabelProps = InputCommonProps & { children: ReactNode }

export function FormWizardInputLabel(props: FormWizardInputLabelProps) {
    const { validated, error } = useInputValidation(props)
    return (
        <FormGroup
            id={`${props.id}-form-group`}
            key={`${props.id}-form-group`}
            fieldId={props.id}
            label={props.label}
            isRequired={props.required}
            helperTextInvalid={error}
            validated={validated}
            helperText={props.helperText}
            labelIcon={<FormWizardLabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
        >
            {props.children}
        </FormGroup>
    )
}
