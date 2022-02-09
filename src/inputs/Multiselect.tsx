import {
    Chip,
    ChipGroup,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Select as PfSelect,
    SelectOptionObject,
    SelectVariant,
} from '@patternfly/react-core'
import { Children, Fragment, isValidElement, ReactElement, ReactNode, useCallback, useState } from 'react'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'
import './Select.css'

type MultiSelectStringsProps = InputCommonProps<string[]> & {
    placeholder?: string
    footer?: ReactNode
    label: string
    isCreatable?: boolean
    onCreate?: (value: string) => void
    children: ReactElement[]
}

export function Multiselect(props: MultiSelectStringsProps) {
    const { displayMode: mode, value, setValue, validated, hidden, id, disabled } = useInput(props)
    const placeholder = props.placeholder ?? `Select the ${lowercaseFirst(props.label)}`
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

    const onFilter = useCallback(
        (_, filterValue: string) =>
            Children.toArray(props.children).filter((child) => {
                if (!isValidElement(child)) return false
                const value = child.props.value
                if (typeof value !== 'string') return false
                return value.includes(filterValue)
            }) as ReactElement[],
        [props.children]
    )

    const selections = value as string[]

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
            <InputLabel {...props}>
                <PfSelect
                    isDisabled={disabled}
                    variant={SelectVariant.checkbox}
                    isOpen={open}
                    onToggle={setOpen}
                    selections={selections}
                    onSelect={onSelect}
                    onClear={props.required ? undefined : onClear}
                    onCreateOption={(value) => props.onCreate?.(value)}
                    validated={validated}
                    onFilter={onFilter}
                    hasInlineFilter={Children.toArray(props.children).length > 10}
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
                    {props.children}
                </PfSelect>
            </InputLabel>
        </div>
    )
}
