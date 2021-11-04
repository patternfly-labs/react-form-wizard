import { Checkbox, DescriptionListDescription, Split } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import { CheckIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { FormWizardIndented } from '../components/FormWizardIndented'
import { FormWizardLabelHelp } from '../components/FormWizardLabelHelp'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardCheckbox(props: {
    id: string
    label: string
    description?: string
    path?: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    hidden?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
    children?: ReactNode
}) {
    const id = props.id
    const path = props.path ?? id

    let formWizardContext = useContext(FormWizardContext)
    let item = useContext(FormWizardItemContext)

    const value = get(item, path)

    const showValidation = false
    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (showValidation) {
        if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    if (props.hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        if (!value) return <Fragment />
        return (
            <Split hasGutter>
                <CheckIcon />
                <DescriptionListDescription>{props.label}</DescriptionListDescription>
            </Split>
        )
    }

    return (
        <Fragment>
            <FormGroup
                id={`${props.id}-form-group`}
                fieldId={id}
                // label={props.label}
                helperTextInvalid={error}
                validated={validated}
                helperText={props.helperText}
                labelIcon={<FormWizardLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            >
                <Checkbox
                    id={id ?? props.label}
                    isChecked={value}
                    onChange={(value) => {
                        set(item, path, value)
                        formWizardContext.updateContext()
                    }}
                    label={props.label}
                    value={value}
                />
            </FormGroup>
            {value && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Fragment>
    )
}
