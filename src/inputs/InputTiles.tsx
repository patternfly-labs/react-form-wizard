import { FormGroup, Gallery, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { InputTextDetail, IRadioGroupContextState, RadioGroupContext } from '..'
import { InputLabelHelp } from '../components/InputLabelHelp'
import { InputContext, InputMode } from '../contexts/InputContext'
import { InputItemContext } from '../contexts/InputItemContext'

export function InputTiles(props: {
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

    let inputContext = useContext(InputContext)
    let item = useContext(InputItemContext)

    const state: IRadioGroupContextState = {
        value: get(item, path),
        setValue: (value) => {
            set(item, path, value)
            inputContext.updateContext()
        },
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (props.hidden) return <Fragment />

    if (inputContext.mode === InputMode.Details) {
        return <InputTextDetail id={props.id} label={props.label} />
    }

    return (
        <RadioGroupContext.Provider value={state}>
            <FormGroup
                id={`${props.id}-form-group`}
                fieldId={props.id}
                label={props.label}
                labelIcon={<InputLabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
                helperText={props.helperText}
                isRequired={props.required}
                // tODO validation.... required...
            >
                <Gallery hasGutter>{props.children}</Gallery>
            </FormGroup>
        </RadioGroupContext.Provider>
    )
}

export function InputTile(props: {
    id: string
    label: string
    value: string | number | boolean
    description?: string
    icon?: ReactNode
    children?: ReactNode
}) {
    const context = useContext(RadioGroupContext)
    return (
        <Tile
            id={props.id}
            name={props.label}
            title={props.label}
            isDisabled={context.disabled}
            readOnly={context.readonly}
            isSelected={context.value === props.value}
            onClick={() => context.setValue?.(props.value)}
            icon={props.icon}
            isDisplayLarge
            isStacked
        >
            {props.description}
        </Tile>
    )
}
