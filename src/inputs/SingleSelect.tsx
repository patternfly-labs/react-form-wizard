import {
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    InputGroup,
    Select as PfSelect,
    SelectOption,
    SelectOptionObject,
    SelectVariant,
} from '@patternfly/react-core'
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'
import './Select.css'

type SingleSelectProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    isCreatable?: boolean
    footer?: ReactNode
    options: string[]
}

export function SingleSelect(props: SingleSelectProps) {
    const { displayMode: mode, value, setValue, validated, hidden, id, disabled } = useInput(props)
    const placeholder = props.placeholder ?? `Select the ${lowercaseFirst(props.label)}`
    const [open, setOpen] = useState(false)

    const onSelect = useCallback(
        (_, selectedString: string | SelectOptionObject) => {
            if (typeof selectedString === 'string') {
                setValue(selectedString)
                setOpen(false)
            }
        },
        [setValue]
    )

    const onClear = useCallback(() => setValue(''), [setValue])

    const onFilter = useCallback(
        (_, filterValue: string) =>
            props.options
                .filter((option) => {
                    if (typeof option !== 'string') return false
                    return option.includes(filterValue)
                })
                .map((option) => (
                    <SelectOption key={option} value={option}>
                        {option}
                    </SelectOption>
                )),
        [props.options]
    )

    useEffect(() => {
        if (!props.isCreatable) {
            if (value && !props.options.includes(value)) {
                setValue('')
            }
        }
    }, [props.isCreatable, props.options, setValue, value])

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>{value}</DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <div id={id}>
            <InputLabel {...props} id={id}>
                <InputGroup>
                    <PfSelect
                        isDisabled={disabled}
                        variant={SelectVariant.single}
                        isOpen={open}
                        onToggle={setOpen}
                        selections={value}
                        onSelect={onSelect}
                        onClear={props.required ? undefined : onClear}
                        validated={validated}
                        onFilter={onFilter}
                        hasInlineFilter={props.isCreatable || props.options.length > 10}
                        footer={props.footer}
                        placeholderText={placeholder}
                        isCreatable={props.isCreatable}
                    >
                        {props.options.map((option) => (
                            <SelectOption id={option} key={option} value={option}>
                                {option}
                            </SelectOption>
                        ))}
                    </PfSelect>
                </InputGroup>
            </InputLabel>
        </div>
    )
}
