import { Button, TextInput } from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { FormWizardContext } from '../contexts/FormWizardContext'
import { ItemContext } from '../contexts/ItemContext'

export function FormWizardKeyValue(props: { id: string; label: string; path: string }) {
    const id = props.id
    const path = props.path ?? id

    const formWizardContext = useContext(FormWizardContext)
    const item = useContext(ItemContext)

    const value = get(item, path) ?? {}

    const [pairs] = useState<{ key: string; value: string }[]>(() => Object.keys(value).map((key) => ({ key, value: value[key] })))

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

    return (
        <div id={props.id} style={{ display: 'flex', flexDirection: 'column', rowGap: pairs.length ? 8 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div className="pf-c-form__label pf-c-form__label-text" style={{ marginBottom: -16, flexGrow: 1 }}>
                    {props.label}
                </div>
                <Button id="add-button" variant="plain" isSmall aria-label="Action" onClick={onNewKey}>
                    <PlusIcon />
                </Button>
            </div>
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
                            <TextInput id={`key-${index + 1}`} value={pair.key} onChange={(e) => onKeyChange(index, e)} />
                            <span>=</span>
                            <TextInput id={`value-${index + 1}`} value={pair.value} onChange={(e) => onValueChange(index, e)} />
                            <Button variant="plain" aria-label="Remove item" onClick={() => onDeleteKey(index)}>
                                <TrashIcon />
                            </Button>
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}
