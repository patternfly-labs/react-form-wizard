import {
    Button,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Split,
    Stack,
    TextInput,
} from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import { Fragment } from 'react'
import { Mode } from '../contexts/ModeContext'
import { InputCommonProps, useInput } from './FormWizardInput'

type StringsInputProps = InputCommonProps & {
    map?: (value: any) => string[]
    unmap?: (values: string[]) => any
    placeholder?: string
}

export function StringsInput(props: StringsInputProps) {
    const { mode, value, setValue, validated, hidden, id } = useInput(props)

    let values: string[] = value
    if (props.map) values = props.map(values)
    else if (!values) values = []

    const onKeyChange = (index: number, newKey: string) => {
        values[index] = newKey
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        setValue(newValue)
    }

    const onNewKey = () => {
        values.push('')
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        setValue(newValue)
    }

    const onDeleteKey = (index: number) => {
        values.splice(index, 1)
        let newValue = values
        if (props.unmap) newValue = props.unmap(values)
        setValue(newValue)
    }

    if (mode === Mode.Details) {
        if (!values.length) return <Fragment />
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>
                    <Stack hasGutter>
                        {values.map((value, index) => {
                            if (!value) return <Fragment />
                            return <div key={index}>{value}</div>
                        })}
                    </Stack>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <div id={id} style={{ display: 'flex', flexDirection: 'column', rowGap: values.length ? 8 : 4 }}>
            <div className="pf-c-form__label pf-c-form__label-text">{props.label}</div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 0,
                }}
            >
                {values.map((pair, index) => {
                    return (
                        <Split key={index}>
                            <TextInput id={`${id}-${index + 1}`} value={pair} onChange={(e) => onKeyChange(index, e)} />
                            <Button variant="plain" aria-label="Remove item" onClick={() => onDeleteKey(index)}>
                                <TrashIcon />
                            </Button>
                        </Split>
                    )
                })}
            </div>
            {!values.length && <Divider />}
            <div>
                <Button id="add-button" variant="link" isSmall aria-label="Action" onClick={onNewKey}>
                    <PlusIcon /> &nbsp; {props.placeholder ?? 'Add'}
                </Button>
            </div>
        </div>
    )
}
