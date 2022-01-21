import { DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Gallery, Tile } from '@patternfly/react-core'
import { Children, Fragment, isValidElement, ReactNode, useContext } from 'react'
import { IRadioGroupContextState, RadioGroupContext } from '..'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, useInput } from './FormWizardInput'
import { InputLabel } from './FormWizardInputLabel'

type FormWizardTilesProps = InputCommonProps & { children?: ReactNode }

// id: string
// label?: string
// path?: string
// readonly?: boolean
// disabled?: boolean
// required?: boolean
// hidden?: boolean
// labelHelp?: string
// labelHelpTitle?: string
// helperText?: string
// children?: ReactNode
export function FormWizardTiles(props: FormWizardTilesProps) {
    const { mode, value, setValue, validated, hidden, id } = useInput(props)

    const state: IRadioGroupContextState = {
        value: value,
        setValue: setValue,
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        let label: string | undefined
        Children.forEach(props.children, (child) => {
            if (!isValidElement(child)) return
            if (child.type !== FormWizardTile) return
            if (child.props.value === value) {
                label = child.props.label
            }
        })
        if (label)
            return (
                <DescriptionListGroup>
                    <DescriptionListTerm>{props.label}</DescriptionListTerm>
                    <DescriptionListDescription id={id}>{label}</DescriptionListDescription>
                </DescriptionListGroup>
            )
        return <Fragment />
    }

    return (
        <RadioGroupContext.Provider value={state}>
            <InputLabel {...props} id={id}>
                <Gallery hasGutter>{props.children}</Gallery>
            </InputLabel>
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
