import { Checkbox, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Split, Stack, Text } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { FormWizardIndented } from '../components/FormWizardIndented'
import { LabelHelp } from '../components/LabelHelp'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { Mode, useMode } from '../contexts/ModeContext'

export function FormWizardCheckbox(props: {
    id: string
    label: string
    path?: string
    placeholder?: string
    secret?: boolean
    readonly?: boolean
    disabled?: boolean
    hidden?: () => boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    validation?: (value: string) => string | undefined
    children?: ReactNode
    title?: string
}) {
    const id = props.id
    const path = props.path ?? id

    const { update } = useData()
    const mode = useMode()
    const item = useContext(ItemContext)

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

    if (mode === Mode.Details) {
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
            <Stack>
                <FormGroup
                    id={`${props.id}-form-group`}
                    fieldId={id}
                    label={props.title}
                    helperTextInvalid={error}
                    validated={validated}
                    // helperText={props.helperText}
                >
                    <Split>
                        <Checkbox
                            id={id ?? props.label}
                            isChecked={value}
                            onChange={(value) => {
                                set(item, path, value)
                                update()
                            }}
                            label={props.label}
                            value={value}
                        />
                        <LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />
                    </Split>
                </FormGroup>
                {props.helperText && (
                    <Text style={{ paddingLeft: 24, paddingTop: 8 }} component="small">
                        {props.helperText}
                    </Text>
                )}
            </Stack>
            {value && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Fragment>
    )
}
