import { Button, Chip, ChipGroup, TextInput } from '@patternfly/react-core'
import { AngleDownIcon, AngleUpIcon, PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardContext } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'

export function FormWizardKeyValue(props: { id: string; label?: string; path?: string; placeholder: string }) {
    const id = props.id
    const path = props.path ?? id

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(FormWizardItemContext)

    const value = get(item, path) ?? {}

    const [pairs, setPairs] = useState<{ key: string; value: string }[]>(() =>
        Object.keys(value).map((key) => ({ key, value: value[key] }))
    )

    const onKeyChange = (index: number, newKey: string) => {
        pairs[index].key = newKey
        set(
            item,
            path,
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
        formWizardContext.updateContext()
    }

    const onValueChange = (index: number, newValue: string) => {
        pairs[index].value = newValue
        set(
            item,
            path,
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
        formWizardContext.updateContext()
    }

    const onNewKey = () => {
        pairs.push({ key: '', value: '' })
        set(
            item,
            path,
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
        formWizardContext.updateContext()
    }

    const onDeleteKey = (index: number) => {
        pairs.splice(index, 1)
        set(
            item,
            path,
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
        formWizardContext.updateContext()
    }

    const [collapsed, setCollapsed] = useState(false)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: pairs.length ? 8 : 0 }}>
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
                        {pairs.map((pair, index) => {
                            return (
                                <Fragment key={index}>
                                    {pair.key && (
                                        <Chip isReadOnly>
                                            {pair.key}
                                            {pair.value && <Fragment> = {pair.value}</Fragment>}
                                        </Chip>
                                    )}
                                </Fragment>
                            )
                        })}
                    </ChipGroup>
                )}
            </div>
            {!collapsed && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'fit-content(200px) fit-content(0) auto fit-content(0)',
                        alignItems: 'center',
                        columnGap: 8,
                        rowGap: 8,
                    }}
                >
                    {pairs.map((pair, index) => {
                        return (
                            <Fragment key={index}>
                                <TextInput value={pair.key} onChange={(e) => onKeyChange(index, e)} />
                                <span>=</span>
                                <TextInput value={pair.value} onChange={(e) => onValueChange(index, e)} />
                                <Button variant="plain" aria-label="Remove item" onClick={() => onDeleteKey(index)}>
                                    <TrashIcon />
                                </Button>
                            </Fragment>
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
