import { Chip, ChipGroup, Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core'
import get from 'get-value'
import { Fragment, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import set from 'set-value'
import { FormWizardTextDetail } from '..'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './FormWizardInput'
import { FormWizardInputLabel } from './FormWizardInputLabel'
import './FormWizardSelect.css'

export interface FormWizardOption<T> {
    id?: string
    icon?: ReactNode
    label: string
    description?: string
    value: T
    disabled?: boolean
}

export interface FormWizardOptionGroup<T> {
    id?: string
    label: string
    options: (FormWizardOption<T> | string | number)[]
}

type FormWizardSelectCommonProps<T> = InputCommonProps<T> & {
    placeholder?: string
    footer?: ReactNode

    /** key path is the path to get the key of the value
     * Used in cases where the value is an object, but we need to track select by a string or number
     */
    keyPath?: string
}

export enum FormWizardSelectVariant {
    Single = 'single',
    Multi = 'multi',
    SingleGrouped = 'single-grouped',
    MultiGrouped = 'multi-grouped',
}

interface FormWizardSingleSelectProps<T> extends FormWizardSelectCommonProps<T> {
    variant: 'single'
    options: (FormWizardOption<T> | string | number)[]
}

interface FormWizardMultiselectProps<T> extends FormWizardSelectCommonProps<T[]> {
    variant: 'multi'
    options: (FormWizardOption<T> | string | number)[]
}

interface FormWizardGroupedSingleSelectProps<T> extends FormWizardSelectCommonProps<T> {
    variant: 'single-grouped'
    groups: FormWizardOptionGroup<T>[]
}

interface FormWizardGroupedMultiselectProps<T> extends FormWizardSelectCommonProps<T[]> {
    variant: 'multi-grouped'
    groups: FormWizardOptionGroup<T>[]
}

export function FormWizardSelect<T>(props: Omit<FormWizardSingleSelectProps<T>, 'variant'>) {
    return <FormWizardSelectBase<T> {...props} variant="single" />
}

export function FormWizardMultiselect<T>(props: Omit<FormWizardMultiselectProps<T>, 'variant'>) {
    return <FormWizardSelectBase<T> {...props} variant="multi" />
}

export function FormWizardGroupedSelect<T>(props: Omit<FormWizardGroupedSingleSelectProps<T>, 'variant'>) {
    return <FormWizardSelectBase<T> {...props} variant="single-grouped" />
}

export function FormWizardGroupedMultiselect<T>(props: Omit<FormWizardGroupedMultiselectProps<T>, 'variant'>) {
    return <FormWizardSelectBase<T> {...props} variant="multi-grouped" />
}

export type FormWizardSelectProps<T> =
    | FormWizardSingleSelectProps<T>
    | FormWizardMultiselectProps<T>
    | FormWizardGroupedSingleSelectProps<T>
    | FormWizardGroupedMultiselectProps<T>

function FormWizardSelectBase<T = any>(props: FormWizardSelectProps<T>) {
    const { mode, value, setValue, validated, hidden, id, path } = useInput(props)

    const { update } = useData()

    const item = useContext(ItemContext)
    const placeholder = props.placeholder ?? `Select the ${lowercaseFirst(props.label)}`

    const keyPath = props.keyPath ?? props.path

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
    }, [props, keyPath])

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
    }, [value, keyPath])

    const selections = useMemo(() => {
        if (Array.isArray(keyedValue)) {
            return selectOptions.filter(
                (selectOption) => keyedValue.find((keyedValue) => keyedValue === selectOption.keyedValue) !== undefined
            )
        } else {
            return selectOptions.find((selectOption) => keyedValue === selectOption.keyedValue)
        }
    }, [keyedValue, selectOptions])

    const onSelect = useCallback(
        (_, selectOptionObject) => {
            switch (props.variant) {
                case 'single':
                case 'single-grouped':
                    set(item, path, selectOptionObject.value, { preservePaths: false })
                    setOpen(false)
                    break
                case 'multi':
                case 'multi-grouped': {
                    let newValues: any[] = []
                    if (Array.isArray(value)) newValues = [...value]
                    if (newValues.includes(selectOptionObject.value)) {
                        newValues = newValues.filter((value) => value !== selectOptionObject.value)
                    } else {
                        newValues.push(selectOptionObject.value)
                    }
                    set(item, path, newValues, { preservePaths: false })
                    break
                }
            }
            update()
        },
        [item, props, update, path, value]
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
    }, [props.variant])

    const onClear = useCallback(() => {
        // set(item, props.path, '', { preservePaths: false })
        update()
    }, [update])

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
        [selectOptions]
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

    if (hidden) return <Fragment />

    if (mode === Mode.Details) {
        return <FormWizardTextDetail id={id} path={props.path} label={props.label} />
    }

    return (
        <div id={id}>
            <FormWizardInputLabel {...props}>
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
            </FormWizardInputLabel>
        </div>
    )
}
