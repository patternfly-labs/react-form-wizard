import { Radio as PfRadio, Stack } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import get from 'get-value'
import { Children, createContext, Fragment, isValidElement, ReactElement, ReactNode, useContext } from 'react'
import set from 'set-value'
import { FormWizardIndented } from '../components/FormWizardIndented'
import { FormWizardLabelHelp } from '../components/FormWizardLabelHelp'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export interface IRadioGroupContextState {
    value?: any
    setValue?: (value: any) => void
    readonly?: boolean
    disabled?: boolean
}

export const RadioGroupContext = createContext<IRadioGroupContextState>({})

export function FormWizardRadioGroup(props: {
    id: string
    label?: string
    path: string
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    hidden?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    children?: ReactNode
}) {
    let formWizardContext = useContext(FormWizardContext)
    let item = useContext(FormWizardItemContext)

    const state: IRadioGroupContextState = {
        value: get(item, props.path),
        setValue: (value) => {
            set(item, props.path, value)
            formWizardContext.updateContext()
        },
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (props.hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        if (!state.value) return <Fragment />

        let selectedChild: ReactElement | undefined
        Children.forEach(props.children, (child) => {
            if (isValidElement(child)) {
                const value = child.props.value
                if (value === state.value) {
                    selectedChild = child
                }
            }
        })

        if (!selectedChild) return <Fragment />
        return <Fragment>{selectedChild}</Fragment>
    }

    return (
        <RadioGroupContext.Provider value={state}>
            <FormGroup
                id={`${props.id}-form-group`}
                fieldId={props.id}
                label={props.label}
                labelIcon={<FormWizardLabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
                helperText={props.helperText}
                isRequired={props.required}
                // tODO validation.... required...
            >
                <Stack hasGutter>{props.children}</Stack>
            </FormGroup>
        </RadioGroupContext.Provider>
    )
}

export function FormWizardRadio(props: {
    id: string
    label: string
    value: string | number | boolean
    description?: string
    children?: ReactNode
}) {
    const radioGroupContext = useContext(RadioGroupContext)
    return (
        <Fragment>
            <PfRadio
                id={props.id}
                name={props.label}
                label={props.label}
                description={props.description}
                isChecked={radioGroupContext.value === props.value}
                onChange={() => radioGroupContext.setValue?.(props.value)}
                isDisabled={radioGroupContext.disabled}
                readOnly={radioGroupContext.readonly}
            />
            {radioGroupContext.value === props.value && <FormWizardIndented>{props.children}</FormWizardIndented>}
        </Fragment>
    )
}
