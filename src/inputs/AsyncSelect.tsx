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
import { SpinnerButton } from '../components/SpinnerButton'
import { SyncButton } from '../components/SyncButton'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'
import './Select.css'

type AsyncSelectProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    isCreatable?: boolean
    asyncCallback?: () => Promise<string[]>
    footer?: ReactNode
}

export function AsyncSelect(props: AsyncSelectProps) {
    const { asyncCallback } = props
    const { displayMode: mode, value, setValue, validated, hidden, id, disabled } = useInput(props)
    const placeholder = props.placeholder ?? `Select the ${lowercaseFirst(props.label)}`
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

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
            options
                .filter((option) => {
                    if (typeof option !== 'string') return false
                    return option.includes(filterValue)
                })
                .map((option) => (
                    <SelectOption key={option} value={option}>
                        {option}
                    </SelectOption>
                )),
        [options]
    )

    const sync = useCallback(() => {
        if (asyncCallback) {
            setLoading((loading) => {
                if (loading) return loading
                if (asyncCallback) {
                    asyncCallback()
                        .then((options) => setOptions(options))
                        .catch(() => null)
                        .finally(() => setLoading(false))
                    return true
                }
                return false
            })
        }
    }, [asyncCallback])

    useEffect(sync, [sync])

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
        <InputLabel {...props} id={id}>
            <InputGroup>
                <PfSelect
                    isDisabled={disabled || (loading && !props.isCreatable)}
                    variant={SelectVariant.single}
                    isOpen={open}
                    onToggle={setOpen}
                    selections={value}
                    onSelect={onSelect}
                    onClear={props.required ? undefined : onClear}
                    validated={validated}
                    onFilter={onFilter}
                    hasInlineFilter={true}
                    footer={props.footer}
                    placeholderText={placeholder}
                    isCreatable={props.isCreatable}
                >
                    {options.map((option) => (
                        <SelectOption key={option} value={option}>
                            {option}
                        </SelectOption>
                    ))}
                    {/* {props.children} */}
                </PfSelect>
                {props.asyncCallback && loading && <SpinnerButton />}
                {props.asyncCallback && !loading && <SyncButton onClick={sync} />}
            </InputGroup>
        </InputLabel>
    )
}