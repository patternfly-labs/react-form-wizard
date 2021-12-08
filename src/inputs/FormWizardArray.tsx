import {
    Alert,
    Button,
    DataList,
    DataListCell,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    FormAlert,
    FormFieldGroupHeader,
    Stack,
    Text,
} from '@patternfly/react-core'
import { ArrowDownIcon, ArrowUpIcon, CaretDownIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Children, Fragment, ReactNode, useCallback, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardTextDetail } from '..'
import { FormWizardFieldGroup } from '../components/FormWizardFieldGroup'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'
import './FormWizardArray.css'

export function FormWizardArrayInput(props: {
    id: string
    label?: string
    description?: string
    path?: string | null
    filter?: (item: any) => boolean
    children: ReactNode
    dropdownItems?: { label: string; action: () => object }[]
    placeholder: string
    collapsedContent: ReactNode
    collapsedPlaceholder?: ReactNode
    sortable?: boolean
    newValue?: object
}) {
    const id = props.id
    const path = props.path !== undefined ? props.path : id

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)
    let sourceArray = get(item, path as string) as object[]

    if (!Array.isArray(sourceArray)) sourceArray = []

    let values = sourceArray
    if (props.filter) values = values.filter(props.filter)

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
                set(item, path, newArray, { preservePaths: false })
            }
            formWizardContext.updateContext()
        },
        [values, item, path, formWizardContext]
    )

    if (formWizardContext.mode === InputMode.Details) {
        return (
            <DataList aria-label="" isCompact>
                {values.map((value, index) => (
                    <FormWizardItemContext.Provider key={index} value={value}>
                        <DataListItem aria-labelledby={`item-${index}`}>
                            <DataListItemRow>
                                <DataListItemCells
                                    dataListCells={[
                                        <DataListCell key="primary content">
                                            <Stack id={`item-${index}`}>
                                                {typeof props.collapsedContent === 'string' ? (
                                                    <FormWizardTextDetail
                                                        id={props.collapsedContent}
                                                        path={props.collapsedContent}
                                                        placeholder={props.collapsedPlaceholder}
                                                    />
                                                ) : (
                                                    props.collapsedContent
                                                )}
                                            </Stack>
                                        </DataListCell>,
                                    ]}
                                />
                            </DataListItemRow>
                        </DataListItem>
                    </FormWizardItemContext.Provider>
                ))}
            </DataList>
        )
    }
    return (
        <div id={props.id} className="form-wizard-array-input">
            {props.label && (
                <div style={{ paddingBottom: 10 }}>
                    <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
                    {props.description && <Text component="small">{props.description}</Text>}
                </div>
            )}
            {values.length === 0 ? (
                <Divider />
            ) : (
                values.map((value, index) => {
                    const hasErrors = false
                    return (
                        <FormWizardItemContext.Provider key={index} value={value}>
                            <FormWizardFieldGroup
                                key={index}
                                id={props.id + index.toString()}
                                isExpanded={collapsed[index.toString()] !== true}
                                setIsExpanded={(isExpanded) => {
                                    setCollapsed((expanded) => ({ ...expanded, ...{ [index.toString()]: !isExpanded } }))
                                }}
                                toggleAriaLabel="Details"
                                header={
                                    <FormFieldGroupHeader
                                        titleText={{
                                            text: hasErrors ? (
                                                <Alert variant="danger" title="Please fix validation errors." isInline isPlain />
                                            ) : (
                                                <Fragment>
                                                    {typeof props.collapsedContent === 'string' ? (
                                                        <FormWizardTextDetail
                                                            id={props.collapsedContent}
                                                            path={props.collapsedContent}
                                                            placeholder={props.collapsedPlaceholder}
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
                                                            onClick={() => {
                                                                const temp = values[index]
                                                                values[index] = values[index - 1]
                                                                values[index - 1] = temp
                                                                formWizardContext.updateContext()
                                                            }}
                                                        >
                                                            <ArrowUpIcon />
                                                        </Button>
                                                        <Button
                                                            variant="plain"
                                                            aria-label="Move item down"
                                                            isDisabled={index === values.length - 1}
                                                            onClick={() => {
                                                                const temp = values[index]
                                                                values[index] = values[index + 1]
                                                                values[index + 1] = temp
                                                                formWizardContext.updateContext()
                                                            }}
                                                        >
                                                            <ArrowDownIcon />
                                                        </Button>
                                                    </Fragment>
                                                )}
                                                <Button
                                                    variant="plain"
                                                    aria-label="Remove item"
                                                    onClick={() => {
                                                        sourceArray.splice(sourceArray.indexOf(value), 1)
                                                        formWizardContext.updateContext()
                                                    }}
                                                >
                                                    <TrashIcon />
                                                </Button>
                                            </Fragment>
                                        }
                                    />
                                }
                            >
                                <Fragment>
                                    {hasErrors && (
                                        <FormAlert>
                                            <Alert variant="danger" title="Please fix validation errors." isInline isPlain />
                                        </FormAlert>
                                    )}
                                    {props.children}
                                    {/* <div className="pf-c-form__helper-text pf-m-error">Error</div> */}
                                </Fragment>
                            </FormWizardFieldGroup>
                        </FormWizardItemContext.Provider>
                    )
                })
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                {/* <div style={{ flexGrow: 1 }} /> */}
                {!props.dropdownItems ? (
                    <Button
                        variant="link"
                        isSmall
                        aria-label="Action"
                        onClick={() => {
                            addItem(props.newValue ?? {})
                        }}
                    >
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

function Dropdown2(props: { children?: ReactNode; placeholder: string }) {
    const [open, setOpen] = useState(false)
    const onToggle = useCallback(() => setOpen((open: boolean) => !open), [])
    return (
        <Dropdown
            isPlain
            dropdownItems={Children.toArray(props.children)}
            toggle={
                <DropdownToggle id="toggle-id" onToggle={onToggle} toggleIndicator={CaretDownIcon}>
                    {props.placeholder}
                </DropdownToggle>
            }
            isOpen={open}
        />
    )
}
