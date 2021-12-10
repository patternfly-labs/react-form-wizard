import { Checkbox, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Split } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
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

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

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
        if (value === undefined) return <Fragment />
        return (
            <DescriptionListGroup id={props.id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>{value ? 'True' : 'False'}</DescriptionListDescription>
            </DescriptionListGroup>
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
            >
                <Split>
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
                    <FormWizardLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />
                </Split>
            </FormGroup>
            {value && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Fragment>
    )
}
