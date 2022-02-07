import { Button, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Divider, TextInput } from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import { Fragment, useState } from 'react'
import { LabelHelp } from '../components/LabelHelp'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, useInput } from './Input'

type KeyValueProps = InputCommonProps & { placeholder?: string }

export function KeyValue(
    props: KeyValueProps
    // id?: string
    // label?: string
    // path?: string
    // placeholder?: string
    // helperText?: string
    // required?: boolean
) {
    const { displayMode: mode, value, setValue, id } = useInput(props)
    const [pairs] = useState<{ key: string; value: string }[]>(() => Object.keys(value).map((key) => ({ key, value: value[key] })))
    const onKeyChange = (index: number, newKey: string) => {
        pairs[index].key = newKey
        setValue(
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
    }

    const onValueChange = (index: number, newValue: string) => {
        pairs[index].value = newValue
        setValue(
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
    }

    const onNewKey = () => {
        pairs.push({ key: '', value: '' })
        setValue(
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
    }

    const onDeleteKey = (index: number) => {
        pairs.splice(index, 1)
        setValue(
            pairs.reduce((result, pair) => {
                result[pair.key] = pair.value
                return result
            }, {} as Record<string, string>)
        )
    }

    if (mode === DisplayMode.Details) {
        if (!pairs.length) return <Fragment />
        return (
            <DescriptionListGroup id={id}>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {pairs.map((pair) => (
                            <div key={pair.key}>
                                {pair.key} {pair.value !== undefined && <span> = {pair.value}</span>}
                            </div>
                        ))}
                    </div>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', rowGap: pairs.length ? 8 : 4 }}>
            <div>
                <span className="pf-c-form__label pf-c-form__label-text">{props.label}</span>
                {props.labelHelp && <LabelHelp id={id} labelHelp={props.labelHelp} labelHelpTitle={props.labelHelpTitle} />}
            </div>
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
