import { Button, Chip, ChipGroup, Split, TextInput } from '@patternfly/react-core'
import { AngleDownIcon, AngleUpIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardContext } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardStringArray(props: {
    id: string
    label?: string
    path?: string
    placeholder: string
    map?: (value: any) => string[]
    unmap?: (values: string[]) => any
}) {
    const id = props.id
    const path = props.path ?? id

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    let values: string[] = get(item, path)
    if (props.map) values = props.map(values)
    else if (!values) values = []

    const onKeyChange = (index: number, newKey: string) => {
        values[index] = newKey
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        formWizardContext.updateContext()
    }

    const onNewKey = () => {
        values.push('')
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        formWizardContext.updateContext()
    }

    const onDeleteKey = (index: number) => {
        values.splice(index, 1)
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        set(item, path, newValue, { preservePaths: false })
        formWizardContext.updateContext()
    }

    const [collapsed, setCollapsed] = useState(false)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: values.length ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                {props.label && (
                    <div className="pf-c-form__label pf-c-form__label-text" style={{ marginBottom: -16 }}>
                        {props.label}
                    </div>
                )}
                <Button variant="plain" isSmall aria-label="Action" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <AngleUpIcon /> : <AngleDownIcon />}
                </Button>
                {collapsed && (
                    <ChipGroup>
                        {values.map((pair, index) => {
                            return <Fragment key={index}>{pair && <Chip isReadOnly>{pair}</Chip>}</Fragment>
                        })}
                    </ChipGroup>
                )}
            </div>
            {!collapsed && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 8,
                    }}
                >
                    {values.map((pair, index) => {
                        return (
                            <Split key={index}>
                                <TextInput value={pair} onChange={(e) => onKeyChange(index, e)} />
                                <Button variant="plain" aria-label="Remove item" onClick={() => onDeleteKey(index)}>
                                    <TrashIcon />
                                </Button>
                            </Split>
                        )
                    })}
                </div>
            )}
            {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <Button variant="link" isSmall aria-label="Action" onClick={onNewKey}>
                        <PlusIcon /> &nbsp; {props.placeholder}
                    </Button>
                </div>
            )}
        </div>
    )
}
