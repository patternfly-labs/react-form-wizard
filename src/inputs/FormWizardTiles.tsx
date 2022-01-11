import { FormGroup, Gallery, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, ReactNode, useCallback, useContext, useState } from 'react'
import set from 'set-value'
import { IRadioGroupContextState, RadioGroupContext } from '..'
import { FormWizardLabelHelp } from '../components/FormWizardLabelHelp'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'
import { wizardArrayItems } from '..'

export function FormWizardTiles(props: {
    id: string
    label?: string
    path?: string
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    hidden?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    children?: ReactNode
}) {
    const path = props.path ?? props.id

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    const state: IRadioGroupContextState = {
        value: get(item, path),
        setValue: (value) => {
            set(item, path, value, { preservePaths: false })
            formWizardContext.updateContext()
        },
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (props.hidden) return <Fragment />

    if (formWizardContext.mode === InputMode.Details) {
        return <Fragment />
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
                <Gallery hasGutter>{props.children}</Gallery>
            </FormGroup>
        </RadioGroupContext.Provider>
    )
}

export function FormWizardTile(props: {
    id: string
    label: string
    value: string | number | boolean
    description?: string
    icon?: ReactNode
    children?: ReactNode
    newValue?: object
    path?: string | null
}) {
    const id = props.id
    const path = props.path !== undefined ? props.path : id
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const context = useContext(RadioGroupContext)
    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)
    const values = wizardArrayItems(props, item)
    const addItem = useCallback(
        (newItem: object | object[]) => {
            let index = 0
            if (path === null) {
                ;(item as any[]).push(newItem)
                index = values.length
            } else {
                let newArray = values
                if (Array.isArray(newItem)) {
                    newArray = [...newArray, ...newItem]
                } else {
                    newArray.push(newItem as never)
                }
                index = newArray.length - 1
                set(item, path, newArray, { preservePaths: false })
            }
            formWizardContext.updateContext()
            setExpanded((expanded) => ({ ...expanded, ...{ [index.toString()]: true } }))
        },
        [values, item, path, formWizardContext]
    )
    return (
        <Tile
            id={props.id}
            name={props.label}
            title={props.label}
            isDisabled={context.disabled}
            readOnly={context.readonly}
            isSelected={context.value === props.value}
            onClick={() => {
                if (props.newValue) {
                    addItem(props.newValue ?? {})
                } else {
                    context.setValue?.(props.value)
                }
            }}
            icon={props.icon}
            isDisplayLarge
            isStacked
        >
            {props.description}
        </Tile>
    )
}
