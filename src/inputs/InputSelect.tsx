import { Chip, ChipGroup, Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core'
import { FormGroup } from '@patternfly/react-core/dist/js/components/Form'
import get from 'get-value'
import { Fragment, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import set from 'set-value'
import { InputTextDetail } from '..'
import { InputLabelHelp } from '../components/InputLabelHelp'
import { InputContext, InputMode } from '../contexts/InputContext'
import { InputItemContext } from '../contexts/InputItemContext'
import { lowercaseFirst } from '../lib/input-utils'
import './InputSelect.css'

export interface InputOption<T> {
    id?: string
    icon?: ReactNode
    label: string
    description?: string
    value: T
    disabled?: boolean
}

export interface InputOptionGroup<T> {
    id?: string
    label: string
    options: (InputOption<T> | string | number)[]
}

interface InputSelectCommonProps {
    id: string
    label: string
    placeholder?: string
    readonly?: boolean
    disabled?: boolean
    required?: boolean
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
    footer?: ReactNode
    path?: string

    /** key path is the path to get the key of the value
     * Used in cases where the value is an object, but we need to track select by a string or number
     */
    keyPath?: string
    hidden?: (values: any) => boolean
}

export enum InputSelectVariant {
    Single = 'single',
    Multi = 'multi',
    SingleGrouped = 'single-grouped',
    MultiGrouped = 'multi-grouped',
}

interface InputSingleSelectProps<T> extends InputSelectCommonProps {
    variant: 'single'
    options: (InputOption<T> | string | number)[]
    validation?: (value: T) => string | undefined
}

interface InputMultiselectProps<T> extends InputSelectCommonProps {
    variant: 'multi'
    options: (InputOption<T> | string | number)[]
    validation?: (values: T[]) => string | undefined
}

interface InputSingleGroupedSelectProps<T> extends InputSelectCommonProps {
    variant: 'single-grouped'
    groups: InputOptionGroup<T>[]
    validation?: (value: T) => string | undefined
}

interface InputMultiGroupedSelectProps<T> extends InputSelectCommonProps {
    variant: 'multi-grouped'
    groups: InputOptionGroup<T>[]
    validation?: (values: T[]) => string | undefined
}

export function InputSelect<T>(props: Omit<InputSingleSelectProps<T>, 'variant'>) {
    return <InputSelectBase<T> {...props} variant="single" />
}

export function InputMultiselect<T>(props: Omit<InputMultiselectProps<T>, 'variant'>) {
    return <InputSelectBase<T> {...props} variant="multi" />
}

export function InputGroupedSelect<T>(props: Omit<InputSingleGroupedSelectProps<T>, 'variant'>) {
    return <InputSelectBase<T> {...props} variant="single-grouped" />
}

export function InputGroupedMultiselect<T>(props: Omit<InputMultiGroupedSelectProps<T>, 'variant'>) {
    return <InputSelectBase<T> {...props} variant="multi-grouped" />
}

export type InputSelectProps<T> =
    | InputSingleSelectProps<T>
    | InputMultiselectProps<T>
    | InputSingleGroupedSelectProps<T>
    | InputMultiGroupedSelectProps<T>

function InputSelectBase<T = any>(props: InputSelectProps<T>) {
    const inputContext = useContext(InputContext)
    const item = useContext(InputItemContext)
    const placeholder = props.placeholder ?? `Select the ${lowercaseFirst(props.label)}`

    const id = props.id
    const path = props.path ?? id
    const keyPath = props.keyPath

    const [open, setOpen] = useState(false)

    // The drop down items with icons and descriptions - optionally grouped
    const selectOptions: ({
        id: string
        icon?: ReactNode
        label: string
        description?: string
        value: string | number | T
        keyedValue: string | number
        disabled?: boolean
    } & SelectOptionObject)[] = useMemo(() => {
        switch (props.variant) {
            case 'single':
            case 'multi':
                return props.options.map((option) => {
                    let id: string
                    let label: string
                    let value: string | number | T
                    let keyedValue: string | number
                    let toString: () => string
                    if (typeof option === 'string' || typeof option === 'number') {
                        id = option.toString()
                        label = option.toString()
                        value = option
                        keyedValue = option
                        toString = () => option.toString()
                    } else {
                        id = option.id ?? option.label
                        label = option.label
                        if (!keyPath) throw new Error()
                        value = option.value
                        keyedValue = get(value as any, keyPath)
                        if (typeof keyedValue !== 'string' && typeof keyedValue !== 'number') {
                            throw new Error()
                        }
                        toString = () => {
                            return (
                                <div key={option.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                    {option?.icon}
                                    {option.label}
                                </div>
                            ) as unknown as string
                        }
                    }
                    const compareTo = (compareTo: any) => compareTo === keyedValue
                    return { id, label, value, keyedValue, toString, compareTo }
                })
            case 'single-grouped':
            case 'multi-grouped': {
                // TODO
                return []
            }
        }
    }, [props])

    const value = useMemo(() => get(item, path), [item, props])

    const keyedValue = useMemo(() => {
        if (typeof value === 'undefined') return ''
        if (typeof value === 'string') return value
        if (typeof value === 'number') return value
        if (Array.isArray(value)) {
            return value.map((value) => {
                if (typeof value === 'string') return value
                if (typeof value === 'number') return value
                if (!keyPath) throw new Error()
                const valueKey = get(value, keyPath)
                if (typeof valueKey === 'string') return valueKey
                if (typeof valueKey === 'number') return valueKey
                throw new Error()
            })
        }
        if (!keyPath) throw new Error()
        const valueKey = get(value, keyPath)
        if (typeof valueKey === 'string') return valueKey
        if (typeof valueKey === 'number') return valueKey
        throw new Error()
    }, [value])

    const selections = useMemo(() => {
        if (Array.isArray(keyedValue)) {
            return selectOptions.filter(
                (selectOption) => keyedValue.find((keyedValue) => keyedValue === selectOption.keyedValue) !== undefined
            )
        } else {
            return selectOptions.find((selectOption) => keyedValue === selectOption.keyedValue)
        }
    }, [keyedValue])

    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (inputContext.showValidation) {
        if (props.required && !selections) {
            error = `${props.label} is required`
        } else if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }

    const onSelect = useCallback(
        (_, selectOptionObject) => {
            switch (props.variant) {
                case 'single':
                case 'single-grouped':
                    set(item, path, selectOptionObject.value)
                    setOpen(false)
                    break
                case 'multi':
                case 'multi-grouped':
                    let newValues: any[] = []
                    if (Array.isArray(value)) newValues = [...value]
                    if (newValues.includes(selectOptionObject.value)) {
                        newValues = newValues.filter((value) => value !== selectOptionObject.value)
                    } else {
                        newValues.push(selectOptionObject.value)
                    }
                    set(item, path, newValues)
                    break
            }
            inputContext.updateContext()
        },
        [item, props, inputContext, selections]
    )

    const isGrouped = useMemo(() => {
        switch (props.variant) {
            case 'single-grouped':
            case 'multi-grouped':
                return true
            case 'single':
            case 'multi':
                return false
        }
    }, [])

    const onClear = useCallback(() => {
        // set(item, props.path, '', { preservePaths: false })
        inputContext.updateContext()
    }, [item, props, inputContext])

    const onFilter = useCallback(
        (_, value: string) =>
            selectOptions
                .filter((option) => option.label.toLowerCase().includes(value.toLowerCase()))
                .map((option) => (
                    <SelectOption
                        key={option.id}
                        id={option.id}
                        value={option}
                        description={option.description}
                        isDisabled={option.disabled}
                    >
                        {option.toString()}
                    </SelectOption>
                )),
        [selectOptions, value]
    )

    const variant = useMemo(() => {
        switch (props.variant) {
            case 'multi':
            case 'multi-grouped':
                return SelectVariant.checkbox
            case 'single':
            case 'single-grouped':
                return SelectVariant.single
        }
    }, [props.variant])

    const hidden = props.hidden ? props.hidden(item) : false
    if (hidden) return <Fragment />

    if (inputContext.mode === InputMode.Details) {
        return <InputTextDetail id={props.id} label={props.label} />
    }

    return (
        <FormGroup
            className="form-multiselect"
            id={`${id}-form-group`}
            fieldId={id}
            label={props.label}
            labelIcon={<InputLabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            helperText={props.helperText}
            helperTextInvalid={error}
            validated={validated}
            isRequired={props.required}
        >
            <Select
                variant={variant}
                isOpen={open}
                onToggle={setOpen}
                selections={selections}
                onSelect={onSelect}
                onClear={props.required ? undefined : onClear}
                // isCreatable
                // onCreateOption
                validated={validated}
                isGrouped={isGrouped}
                hasInlineFilter
                onFilter={onFilter}
                footer={props.footer}
                placeholderText={
                    Array.isArray(selections) ? (
                        selections.length === 0 ? (
                            placeholder
                        ) : (
                            <ChipGroup style={{ marginTop: -8, marginBottom: -8 }} numChips={9999}>
                                {selections.map((selection) => (
                                    <Chip isReadOnly key={selection.id}>
                                        {selection.label}
                                    </Chip>
                                ))}
                            </ChipGroup>
                        )
                    ) : (
                        placeholder
                    )
                }
            >
                {selectOptions.map((option) => (
                    <SelectOption
                        key={option.id}
                        id={option.id}
                        value={option}
                        description={option.description}
                        isDisabled={option.disabled}
                    >
                        {option.toString()}
                    </SelectOption>
                ))}
            </Select>
        </FormGroup>
    )
}
