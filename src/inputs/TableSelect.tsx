import {
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    DropdownToggle,
    DropdownToggleCheckbox,
    Pagination,
    PaginationVariant,
} from '@patternfly/react-core'
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table'
import { Fragment, ReactNode, useCallback, useMemo, useState } from 'react'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, useInput } from './Input'
import { InputLabel } from './InputLabel'

interface ITableColumn<T> {
    name: string
    cellFn: (item: T) => ReactNode
}

export type TableSelectProps<T> = InputCommonProps<string> & {
    label: string
    columns: ITableColumn<T>[]
    items: T[]
    itemToValue?: (item: T) => unknown
    valueMatchesItem?: (value: unknown, item: T) => boolean
    emptyMessage: string
}

export function TableSelect<T = any>(props: TableSelectProps<T>) {
    const { displayMode: mode, value, setValue, hidden, id } = useInput(props)

    const [page, setPage] = useState(1)
    const onSetPage = useCallback((_: unknown, page) => setPage(page), [])

    const pagedItems = useMemo(() => {
        return props.items.slice((page - 1) * 10, page * 10)
    }, [page, props.items])

    let values = value as unknown[]
    if (!Array.isArray(values)) values = []
    let selectedItems: T[] = values
    if (props.valueMatchesItem)
        selectedItems = values
            .map((value) => props.items.find((item) => (props.valueMatchesItem ? props.valueMatchesItem(value, item) : false)))
            .filter((item) => item !== undefined) as T[]

    const onSelect = useCallback(
        (item: T, select: boolean) => {
            if (select) {
                if (!selectedItems.includes(item)) {
                    setValue([
                        ...(props.itemToValue ? selectedItems.map(props.itemToValue) : selectedItems),
                        props.itemToValue ? props.itemToValue(item) : pagedItems,
                    ])
                }
            } else {
                if (props.itemToValue) {
                    setValue(selectedItems.filter((i) => i !== item).map(props.itemToValue))
                } else {
                    setValue(selectedItems.filter((i) => i !== item))
                }
            }
        },
        [pagedItems, props, selectedItems, setValue]
    )
    const isSelected = useCallback((item: T) => selectedItems.includes(item), [selectedItems])

    const selectAll = useCallback(
        () => setValue(props.itemToValue ? props.items.map(props.itemToValue) : props.items),
        [props.items, props.itemToValue, setValue]
    )
    const selectPage = useCallback(() => {
        let newValue = [
            ...(props.itemToValue ? selectedItems.map(props.itemToValue) : selectedItems),
            ...(props.itemToValue ? pagedItems.map(props.itemToValue) : pagedItems),
        ]
        newValue = newValue.filter(onlyUnique)
        setValue(newValue)
    }, [pagedItems, props.itemToValue, selectedItems, setValue])
    const selectNone = useCallback(() => setValue([]), [setValue])

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!selectedItems.length) return <Fragment />
        if (values.length > 5) {
            return (
                <DescriptionListGroup>
                    <DescriptionListTerm>{props.label}</DescriptionListTerm>
                    <DescriptionListDescription id={id}>{values.length} selected</DescriptionListDescription>
                </DescriptionListGroup>
            )
        }
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {values.map((value, index) => {
                            if (!value) return <Fragment key={index} />
                            return <div key={index}>{value}</div>
                        })}
                    </div>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    if (props.items.length === 0) {
        return <div>{props.emptyMessage}</div>
    }

    return (
        <InputLabel {...props}>
            <div style={{ display: 'flex', gap: 8 }}>
                <BulkSelect
                    selectedCount={selectedItems.length}
                    selectAll={selectAll}
                    selectPage={selectPage}
                    selectNone={selectNone}
                    perPage={10}
                    total={props.items.length}
                />
                {/* <SearchInput style={{ flexGrow: 1 }} /> */}
            </div>
            <TableComposable aria-label={props.label} variant="compact" id={id}>
                <Thead>
                    <Tr>
                        <Th />
                        {props.columns.map((column) => (
                            <Th key={column.name}>{column.name}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {pagedItems.map((item, index) => (
                        <Tr key={index}>
                            <Td
                                select={{
                                    rowIndex: index,
                                    onSelect: (_event, isSelecting) => onSelect(item, isSelecting),
                                    isSelected: isSelected(item),
                                }}
                            />
                            {props.columns.map((column) => (
                                <Td key={column.name}>{column.cellFn(item)}</Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </TableComposable>
            {props.items.length > 10 && (
                <Pagination
                    itemCount={props.items.length}
                    perPage={10}
                    variant={PaginationVariant.bottom}
                    page={page}
                    onSetPage={onSetPage}
                    perPageOptions={[]}
                />
            )}
        </InputLabel>
    )
}

function BulkSelect(props: {
    selectedCount: number
    total: number
    perPage: number
    selectNone: () => void
    selectPage: () => void
    selectAll: () => void
}) {
    const [open, setOpen] = useState(false)
    const onDropDownToggle = useCallback(() => setOpen((open) => !open), [])

    const allSelected = props.selectedCount === props.total
    const anySelected = props.selectedCount > 0
    const someChecked = props.selectedCount ? null : false
    const isChecked = allSelected ? true : someChecked

    const items = useMemo(() => {
        const dropdownItems = [
            <DropdownItem key="item-1" onClick={props.selectNone}>
                Select none (0 items)
            </DropdownItem>,
        ]
        if (props.total > props.perPage) {
            dropdownItems.push(
                <DropdownItem key="item-2" onClick={props.selectPage}>
                    Select page ({props.perPage} items)
                </DropdownItem>
            )
        }
        dropdownItems.push(
            <DropdownItem key="item-3" onClick={props.selectAll}>
                Select all ({props.total} items)
            </DropdownItem>
        )
        return dropdownItems
    }, [props.perPage, props.selectAll, props.selectNone, props.selectPage, props.total])

    const { selectNone, selectAll } = props
    const onCheckbox = useCallback(() => {
        anySelected ? selectNone() : selectAll()
    }, [anySelected, selectNone, selectAll])

    const splitButtonItems = useMemo(
        () => [
            <DropdownToggleCheckbox
                id="example-checkbox-2"
                key="split-checkbox"
                aria-label={anySelected ? 'Deselect all' : 'Select all'}
                isChecked={isChecked}
                onClick={onCheckbox}
            />,
        ],
        [anySelected, isChecked, onCheckbox]
    )

    const toggle = useMemo(
        () => (
            <DropdownToggle splitButtonItems={splitButtonItems} onToggle={onDropDownToggle}>
                {props.selectedCount !== 0 && <Fragment>{props.selectedCount} selected</Fragment>}
            </DropdownToggle>
        ),
        [onDropDownToggle, props.selectedCount, splitButtonItems]
    )

    return <Dropdown onSelect={onDropDownToggle} toggle={toggle} isOpen={open} dropdownItems={items} position={DropdownPosition.left} />
}

function onlyUnique(value: unknown, index: number, self: unknown[]) {
    return self.indexOf(value) === index
}
