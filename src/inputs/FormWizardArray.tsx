import {
    Alert,
    Button,
    DataList,
    DataListCell,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    DescriptionListDescription,
    Divider,
    FormAlert,
    FormFieldGroupHeader,
    Stack,
} from '@patternfly/react-core'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, ReactNode, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardFieldGroup } from '../components/FormWizardFieldGroup'
import { FormWizardContext, InputMode } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardArrayInput(props: {
    id: string
    label?: string
    path?: string
    children: ReactNode
    placeholder: string
    collapsedText: ReactNode
    collapsedDescription?: ReactNode
    sortable?: boolean
}) {
    const id = props.id
    const path = props.path ?? id

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

    let formWizardContext = useContext(FormWizardContext)
    let item = useContext(FormWizardItemContext)
    let values = get(item, path) as []
    if (!Array.isArray(values)) values = []

    if (formWizardContext.mode === InputMode.Details) {
        return (
            <DataList aria-label="" isCompact>
                {values.map((value, index) => (
                    <FormWizardItemContext.Provider value={value}>
                        <DataListItem aria-labelledby={`item-${index}`}>
                            <DataListItemRow>
                                <DataListItemCells
                                    dataListCells={[
                                        <DataListCell key="primary content">
                                            <Stack id={`item-${index}`}>
                                                {props.collapsedText}
                                                {props.collapsedDescription && (
                                                    <DescriptionListDescription>{props.collapsedDescription}</DescriptionListDescription>
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
        <Fragment>
            {props.label && (
                <div className="pf-c-form__label pf-c-form__label-text" style={{ marginBottom: -16 }}>
                    {props.label}
                </div>
            )}
            {values.length === 0 ? (
                <Divider />
            ) : (
                values.map((value, index) => {
                    const hasErrors = false
                    return (
                        <FormWizardItemContext.Provider value={value}>
                            <FormWizardFieldGroup
                                key={index}
                                id={index.toString()}
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
                                                props.collapsedText
                                            ),
                                            id: `nested-field-group1-titleText-id-${index}`,
                                        }}
                                        titleDescription={!hasErrors && props.collapsedDescription ? props.collapsedDescription : undefined}
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
                                                        values.splice(index, 1)
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
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: -20, marginBottom: -8, gap: 8 }}>
                {/* <div style={{ flexGrow: 1 }} /> */}
                <Button
                    variant="link"
                    isSmall
                    aria-label="Action"
                    onClick={() => {
                        if (values) {
                            values.push({} as never)
                        } else {
                            values = []
                        }
                        set(item, path, values)
                        formWizardContext.updateContext()
                    }}
                >
                    <PlusIcon /> &nbsp; {props.placeholder}
                </Button>
            </div>
        </Fragment>
    )
}
