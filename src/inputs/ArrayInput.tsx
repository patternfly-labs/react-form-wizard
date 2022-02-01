import {
    Button,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    FormFieldGroupHeader,
    Split,
    SplitItem,
    Text,
} from '@patternfly/react-core'
import { ArrowDownIcon, ArrowUpIcon, CaretDownIcon, ExclamationCircleIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Children, Fragment, ReactNode, useCallback, useContext, useState } from 'react'
import { TextDetail } from '..'
import { FieldGroup } from '../components/FieldGroup'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { ShowValidationContext } from '../contexts/ShowValidationProvider'
import { HasValidationErrorContext, ValidationProvider } from '../contexts/ValidationProvider'
import './ArrayInput.css'
import { InputCommonProps, useInput } from './Input'

export function wizardArrayItems(props: any, item: any) {
    const id = props.id
    const path = props.path !== undefined ? props.path : id
    let sourceArray = get(item, path as string) as object[]
    if (!Array.isArray(sourceArray)) sourceArray = []
    let values = sourceArray
    if (props.filter) values = values.filter(props.filter)
    return values
}

export type ArrayInputProps = Omit<InputCommonProps, 'path'> & {
    path: string | null
    description?: string
    children: ReactNode
    filter?: (item: any) => boolean
    dropdownItems?: { label: string; action: () => object }[]
    placeholder: string
    collapsedContent: ReactNode
    collapsedPlaceholder?: ReactNode
    sortable?: boolean
    newValue?: object
}

export function ArrayInput(props: ArrayInputProps) {
    const { displayMode: mode, value, setValue, hidden, id } = useInput(props as InputCommonProps)

    const path = props.path

    const { update } = useData()
    const item = useContext(ItemContext)
    const values = wizardArrayItems(props, item)

    const addItem = useCallback(
        (newItem: object | object[]) => {
            if (path === null) {
                ;(item as any[]).push(newItem)
            } else {
                let newArray = values
                if (Array.isArray(newItem)) {
                    newArray = [...newArray, ...newItem]
                } else {
                    newArray.push(newItem as never)
                }
                setValue(newArray)
            }
            update()
        },
        [item, path, setValue, update, values]
    )

    const removeItem = useCallback(
        (index: number) => {
            ;(value as Array<object>).splice(index, 1)
            setValue(value)
        },
        [setValue, value]
    )

    const moveUp = useCallback(
        (index: number) => {
            const temp = value[index]
            value[index] = value[index - 1]
            value[index - 1] = temp
            setValue(value)
        },
        [setValue, value]
    )

    const moveDown = useCallback(
        (index: number) => {
            const temp = value[index]
            value[index] = value[index + 1]
            value[index + 1] = temp
            setValue(value)
        },
        [setValue, value]
    )

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (values.length === 0) {
            return <Fragment />
        }
        return (
            <DescriptionListGroup id={id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {values.map((value, index) => (
                            <div key={index}>
                                <ItemContext.Provider value={value}>
                                    {typeof props.collapsedContent === 'string' ? (
                                        <TextDetail
                                            id={props.collapsedContent}
                                            path={props.collapsedContent}
                                            placeholder={props.collapsedPlaceholder}
                                        />
                                    ) : (
                                        props.collapsedContent
                                    )}
                                </ItemContext.Provider>
                            </div>
                        ))}
                    </div>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }
    return (
        <div id={id} className="form-wizard-array-input">
            {props.label && (
                <div style={{ paddingBottom: 8, paddingTop: 0 }}>
                    <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
                    {props.description && <Text component="small">{props.description}</Text>}
                </div>
            )}
            {values.length === 0 ? (
                <Divider />
            ) : (
                values.map((value, index) => {
                    return (
                        <ArrayInputItem
                            key={index}
                            id={id}
                            value={value}
                            index={index}
                            count={values.length}
                            collapsedContent={props.collapsedContent}
                            collapsedPlaceholder={props.collapsedPlaceholder}
                            sortable={props.sortable}
                            moveUp={moveUp}
                            moveDown={moveDown}
                            removeItem={removeItem}
                        >
                            {props.children}
                        </ArrayInputItem>
                    )
                })
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingTop: values.length ? 8 : 4 }}>
                {/* <div style={{ flexGrow: 1 }} /> */}
                {!props.dropdownItems ? (
                    <Button id="add-button" variant="link" isSmall aria-label="Action" onClick={() => addItem(props.newValue ?? {})}>
                        <PlusIcon /> &nbsp; {props.placeholder}
                    </Button>
                ) : (
                    <Dropdown2 placeholder={props.placeholder}>
                        {props.dropdownItems.map((item, index) => {
                            return (
                                <DropdownItem key={index} onClick={() => addItem(item.action())}>
                                    {item.label}
                                </DropdownItem>
                            )
                        })}
                    </Dropdown2>
                )}
            </div>
        </div>
    )
}

export function ArrayInputItem(props: {
    id: string
    value: object
    index: number
    count: number
    children: ReactNode
    defaultExpanded?: boolean
    collapsedContent: ReactNode
    collapsedPlaceholder?: ReactNode
    sortable?: boolean
    moveUp: (index: number) => void
    moveDown: (index: number) => void
    removeItem: (index: number) => void
}) {
    const { id, value, index, defaultExpanded, moveUp, moveDown, removeItem } = props
    const [expanded, setExpanded] = useState(defaultExpanded !== undefined ? defaultExpanded : true)

    return (
        <ValidationProvider>
            <ShowValidationContext.Consumer>
                {(showValidation) => (
                    <HasValidationErrorContext.Consumer>
                        {(hasErrors) => (
                            <ItemContext.Provider value={value}>
                                <FieldGroup
                                    id={id + '-' + (index + 1).toString()}
                                    isExpanded={expanded}
                                    setIsExpanded={setExpanded}
                                    toggleAriaLabel="Details"
                                    header={
                                        <FormFieldGroupHeader
                                            titleText={{
                                                text:
                                                    showValidation && hasErrors ? (
                                                        <Split>
                                                            <SplitItem>
                                                                <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
                                                            </SplitItem>
                                                            <SplitItem>
                                                                <span className="pf-c-form__helper-text pf-m-error">
                                                                    &nbsp; Expand to fix validation errors
                                                                </span>
                                                            </SplitItem>
                                                        </Split>
                                                    ) : (
                                                        <Fragment>
                                                            {typeof props.collapsedContent === 'string' ? (
                                                                <TextDetail
                                                                    id={props.collapsedContent}
                                                                    path={props.collapsedContent}
                                                                    placeholder={props.collapsedPlaceholder ?? 'Expand to edit'}
                                                                />
                                                            ) : (
                                                                props.collapsedContent
                                                            )}
                                                        </Fragment>
                                                    ),
                                                id: `nested-field-group1-titleText-id-${index}`,
                                            }}
                                            // titleDescription={!hasErrors && props.collapsedDescription ? props.collapsedDescription : undefined}
                                            actions={
                                                <Fragment>
                                                    {props.sortable && (
                                                        <Fragment>
                                                            <Button
                                                                variant="plain"
                                                                aria-label="Move item up"
                                                                isDisabled={index === 0}
                                                                onClick={() => moveUp(index)}
                                                            >
                                                                <ArrowUpIcon />
                                                            </Button>
                                                            <Button
                                                                variant="plain"
                                                                aria-label="Move item down"
                                                                isDisabled={index === props.count - 1}
                                                                onClick={() => moveDown(index)}
                                                            >
                                                                <ArrowDownIcon />
                                                            </Button>
                                                        </Fragment>
                                                    )}
                                                    <Button variant="plain" aria-label="Remove item" onClick={() => removeItem(index)}>
                                                        <TrashIcon />
                                                    </Button>
                                                </Fragment>
                                            }
                                        />
                                    }
                                >
                                    {props.children}
                                </FieldGroup>
                            </ItemContext.Provider>
                        )}
                    </HasValidationErrorContext.Consumer>
                )}
            </ShowValidationContext.Consumer>
        </ValidationProvider>
    )
}

function Dropdown2(props: { children?: ReactNode; placeholder: string }) {
    const [open, setOpen] = useState(false)
    const onToggle = useCallback(() => setOpen((open: boolean) => !open), [])
    return (
        <Dropdown
            isPlain
            dropdownItems={Children.toArray(props.children)}
            toggle={
                <DropdownToggle id="toggle-id" onToggle={onToggle} toggleIndicator={CaretDownIcon} style={{ paddingTop: 0 }}>
                    <span className="pf-c-button pf-m-link pf-m-small" style={{ padding: 0 }}>
                        <PlusIcon />
                        &nbsp; &nbsp;
                        {props.placeholder}
                    </span>
                </DropdownToggle>
            }
            isOpen={open}
        />
    )
}
