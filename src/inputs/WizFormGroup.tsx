import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { ReactNode } from 'react'
import { LabelHelp } from '../components/LabelHelp'
import { InputCommonProps, useID, useInputValidation } from './Input'

type WizFormGroupProps = InputCommonProps & {
    children: ReactNode
    isHelperTextBeforeField?: boolean
    helperTextInvalid?: (error: string | undefined) => ReactNode
    helperTextNode?: ReactNode
}

export function WizFormGroup(props: WizFormGroupProps) {
    const { validated, error } = useInputValidation(props)
    const { helperTextInvalid, helperTextNode } = props
    const id = useID(props)
    return (
        <FormGroup
            id={`${id}-form-group`}
            key={`${id}-form-group`}
            fieldId={id}
            label={props.label}
            isRequired={props.required}
            helperTextInvalid={helperTextInvalid ? helperTextInvalid(error) : error}
            validated={validated}
            helperText={helperTextNode}
            labelIcon={<LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            isHelperTextBeforeField={props.isHelperTextBeforeField}
        >
            {props.children}
        </FormGroup>
    )
}
