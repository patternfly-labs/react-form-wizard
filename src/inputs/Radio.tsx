import { DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Radio as PfRadio } from '@patternfly/react-core'
import { Children, createContext, Fragment, isValidElement, ReactElement, ReactNode, useContext } from 'react'
import { Indented } from '../components/Indented'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, useInput } from './Input'
import { InputLabel } from './InputLabel'

export interface IRadioGroupContextState {
    value?: any
    setValue?: (value: any) => void
    readonly?: boolean
    disabled?: boolean
}

export const RadioGroupContext = createContext<IRadioGroupContextState>({})

type RadioGroupProps = InputCommonProps & { children?: ReactNode }

export function RadioGroup(props: RadioGroupProps) {
    const { mode, value, setValue, hidden, id } = useInput(props)

    const state: IRadioGroupContextState = {
        value,
        setValue,
        readonly: props.readonly,
        disabled: props.disabled,
    }

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        if (!state.value) return <Fragment />

        let selectedChild: ReactElement | undefined
        Children.forEach(props.children, (child) => {
            if (isValidElement(child)) {
                const value = child.props.value
                if (value === state.value) {
                    selectedChild = child.props.label
                }
            }
        })

        if (!selectedChild) return <Fragment />
        return (
            <DescriptionListGroup id={id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>{selectedChild}</DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <RadioGroupContext.Provider value={state}>
            <InputLabel {...props} id={id}>
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>{props.children}</div>
            </InputLabel>
        </RadioGroupContext.Provider>
    )
}

export function Radio(props: { id: string; label: string; value: string | number | boolean; description?: string; children?: ReactNode }) {
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
            {radioGroupContext.value === props.value && <Indented>{props.children}</Indented>}
        </Fragment>
    )
}
