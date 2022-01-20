import { Button, Divider, TextInput } from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import get from 'get-value'
import { Fragment, useContext, useState } from 'react'
import set from 'set-value'
import { useData } from '../contexts/DataContext'
import { ItemContext } from '../contexts/ItemContext'
import { useID, usePath } from './FormWizardInput'

export function KeyValue(props: {
    id?: string
    label?: string
    path?: string
    placeholder?: string
    helperText?: string
    required?: boolean
}) {
    const id = useID(props)
    const path = usePath(props)

    const { update } = useData()
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
        update()
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
        update()
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
        update()
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
        update()
    }

    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', rowGap: pairs.length ? 8 : 4 }}>
            <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
            {props.helperText && <div>{props.helperText}</div>}
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
            {!Object.keys(pairs).length && <Divider />}
            <div>
                <Button id="add-button" variant="link" isSmall aria-label="Action" onClick={onNewKey}>
                    <PlusIcon /> &nbsp; {props.placeholder ?? 'Add'}
                </Button>
            </div>
        </div>
    )
}
