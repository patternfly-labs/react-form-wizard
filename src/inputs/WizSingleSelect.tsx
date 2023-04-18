import {
    Button,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    InputGroup,
    Select as PfSelect,
    SelectOption,
    SelectOptionObject,
    SelectVariant,
    Split,
    SplitItem,
} from '@patternfly/react-core'
import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, getSelectPlaceholder, useInput } from './Input'
import './Select.css'
import { WizFormGroup } from './WizFormGroup'
import { HelperTextPrompt } from '../components/HelperTextPrompt'

export type WizSingleSelectProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    isCreatable?: boolean
    footer?: ReactNode
    prompt?: { label: string; href: string; isDisabled?: boolean }
    options: string[]
}

export function WizSingleSelect(props: WizSingleSelectProps) {
    const { displayMode: mode, value, setValue, validated, hidden, id, disabled } = useInput(props)
    const placeholder = getSelectPlaceholder(props)
    const { prompt, helperText } = props
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
            <WizFormGroup helperTextNode={HelperTextPrompt({ prompt, helperText })} {...props} id={id}>
                <InputGroup>
                    <PfSelect
                        isDisabled={disabled || props.readonly}
                        variant={SelectVariant.single}
                        isOpen={open}
                        onToggle={setOpen}
                        selections={value}
                        onSelect={onSelect}
                        onClear={props.required ? undefined : onClear}
                        validated={validated}
                        onFilter={onFilter}
                        hasInlineFilter
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
            </WizFormGroup>
        </div>
    )
}
