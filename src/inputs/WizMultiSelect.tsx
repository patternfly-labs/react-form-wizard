import {
    Chip,
    ChipGroup,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Select as PfSelect,
    SelectOption,
    SelectOptionObject,
    SelectVariant,
} from '@patternfly/react-core'
import { Fragment, ReactNode, useCallback, useMemo, useState } from 'react'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, getSelectPlaceholder, useInput } from './Input'
import './Select.css'
import { WizFormGroup } from './WizFormGroup'

export type WizMultiSelectProps = InputCommonProps<string[]> & {
    placeholder?: string
    footer?: ReactNode
    label: string
    isCreatable?: boolean
    options: string[]
}

export function WizMultiSelect(props: WizMultiSelectProps) {
    const { displayMode: mode, value, setValue, validated, hidden, id, disabled } = useInput(props)
    const placeholder = getSelectPlaceholder(props)
    const [open, setOpen] = useState(false)

    const onSelect = useCallback(
        (_, selectedString: string | SelectOptionObject) => {
            if (typeof selectedString === 'string') {
                let newValues: any[]
                if (Array.isArray(value)) newValues = [...value]
                else newValues = []
                if (newValues.includes(selectedString)) {
                    newValues = newValues.filter((value) => value !== selectedString)
                } else {
                    newValues.push(selectedString)
                }
                setValue(newValues)
            }
        },
        [setValue, value]
    )

    const onClear = useCallback(() => {
        setValue([])
    }, [setValue])

    const selections = useMemo(() => value as string[], [value])

    const options = useMemo(() => {
        const map: Record<string, true> = {}
        for (const option of props.options) {
            map[option] = true
        }
        if (Array.isArray(selections)) {
            for (const option of selections) {
                map[option] = true
            }
        }
        return Object.keys(map).sort()
    }, [props.options, selections])

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

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>
                    {selections.length > 5 ? (
                        `${selections.length} selected`
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                            {selections.map((selection, index) => {
                                return <div key={index}>{selection}</div>
                            })}
                        </div>
                    )}
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <div id={id}>
            <WizFormGroup {...props}>
                <PfSelect
                    isDisabled={disabled}
                    variant={SelectVariant.checkbox}
                    isOpen={open}
                    onToggle={setOpen}
                    selections={selections}
                    onSelect={onSelect}
                    onClear={props.required ? undefined : onClear}
                    isCreatable={props.isCreatable}
                    validated={validated}
                    onFilter={onFilter}
                    hasInlineFilter
                    footer={props.footer}
                    placeholderText={
                        Array.isArray(selections) ? (
                            selections.length === 0 ? (
                                placeholder
                            ) : (
                                <ChipGroup style={{ marginTop: -8, marginBottom: -8 }} numChips={9999}>
                                    {selections.map((selection) => (
                                        <Chip isReadOnly key={selection}>
                                            {selection}
                                        </Chip>
                                    ))}
                                </ChipGroup>
                            )
                        ) : (
                            placeholder
                        )
                    }
                >
                    {options.map((option) => (
                        <SelectOption id={option} key={option} value={option}>
                            {option}
                        </SelectOption>
                    ))}
                </PfSelect>
            </WizFormGroup>
        </div>
    )
}
