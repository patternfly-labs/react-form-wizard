import { FormGroup, Gallery, Tile } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, ReactNode, useContext } from 'react'
import set from 'set-value'
import { IRadioGroupContextState, RadioGroupContext } from '..'
import { LabelHelp } from '../components/LabelHelp'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { Mode, useMode } from '../contexts/ModeContext'

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

    const mode = useMode()
    const { update } = useData()
    const item = useContext(ItemContext)

    const state: IRadioGroupContextState = {
        value: get(item, path),
        setValue: (value) => {
            set(item, path, value, { preservePaths: false })
            update()
        },
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (props.hidden) return <Fragment />

    if (mode === Mode.Details) {
        return <Fragment />
    }

    return (
        <RadioGroupContext.Provider value={state}>
            <FormGroup
                id={`${props.id}-form-group`}
                fieldId={props.id}
                label={props.label}
                labelIcon={<LabelHelp id={props.id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
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
