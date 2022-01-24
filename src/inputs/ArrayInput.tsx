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
    Stack,
    Text,
} from '@patternfly/react-core'
import { ArrowDownIcon, ArrowUpIcon, CaretDownIcon, ExclamationCircleIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Children, Fragment, ReactNode, useCallback, useContext, useState } from 'react'
import set from 'set-value'
import { TextDetail } from '..'
import { FieldGroup } from '../components/FieldGroup'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { Mode, useMode } from '../contexts/ModeContext'
import { ShowValidationContext } from '../contexts/ShowValidationProvider'
import { HasValidationErrorContext, ValidationProvider } from '../contexts/ValidationProvider'
import './ArrayInput.css'

export function wizardArrayItems(props: any, item: any) {
    const id = props.id
    const path = props.path !== undefined ? props.path : id
    let sourceArray = get(item, path as string) as object[]
    if (!Array.isArray(sourceArray)) sourceArray = []
    let values = sourceArray
    if (props.filter) values = values.filter(props.filter)
    return values
}

export function ArrayInput(props: {
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

    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const { update } = useData()
    const mode = useMode()
    const item = useContext(ItemContext)
    const sourceArray = get(item, path as string) as object[]

    const values = wizardArrayItems(props, item)

    const addItem = useCallback(
        (newItem: object | object[]) => {
            let index = 0
            if (path === null) {
                ;(item as any[]).push(newItem)
                index = values.length
            } else {
                let newArray = values
                if (Array.isArray(newItem)) {
                    newArray = [...newArray, ...newItem]
                } else {
                    newArray.push(newItem as never)
                }
                index = newArray.length - 1
                set(item, path, newArray, { preservePaths: false })
            }
            update()
            setExpanded((expanded) => ({ ...expanded, ...{ [index.toString()]: true } }))
        },
        [path, update, item, values]
    )

    if (mode === Mode.Details) {
        if (values.length === 0) {
            return <Fragment />
        }
        return (
            <DescriptionListGroup id={props.id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>
                    <Stack hasGutter>
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
                    </Stack>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }
    return (
        <div id={props.id} className="form-wizard-array-input">
            {props.label && (
                <div style={{ paddingBottom: 10, paddingTop: 4 }}>
                    <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
                    {props.description && <Text component="small">{props.description}</Text>}
                </div>
            )}
            {values.length === 0 ? (
                <Divider />
            ) : (
                values.map((value, index) => {
                    return (
                        <ValidationProvider key={index}>
                            <ShowValidationContext.Consumer>
                                {(showValidation) => (
                                    <HasValidationErrorContext.Consumer>
                                        {(hasErrors) => (
                                            <ItemContext.Provider value={value}>
                                                <FieldGroup
                                                    key={index}
                                                    id={props.id + '-' + (index + 1).toString()}
                                                    isExpanded={expanded[index.toString()] === true}
                                                    setIsExpanded={(isExpanded) => {
                                                        setExpanded((expanded) => ({ ...expanded, ...{ [index.toString()]: isExpanded } }))
                                                    }}
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
                                                                                    placeholder={
                                                                                        props.collapsedPlaceholder ?? 'Expand to edit'
                                                                                    }
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
                                                                                    update()
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
                                                                                    update()
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
                                                                            update()
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
                                                        {/* {showValidation && hasErrors && (
                                                            <FormAlert>
                                                                <Alert
                                                                    variant="danger"
                                                                    title="Please fix validation errors."
                                                                    isInline
                                                                    isPlain
                                                                />
                                                            </FormAlert>
                                                        )} */}
                                                        {props.children}
                                                        {/* <div className="pf-c-form__helper-text pf-m-error">Error</div> */}
                                                    </Fragment>
                                                </FieldGroup>
                                            </ItemContext.Provider>
                                        )}
                                    </HasValidationErrorContext.Consumer>
                                )}
                            </ShowValidationContext.Consumer>
                        </ValidationProvider>
                    )
                })
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
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
