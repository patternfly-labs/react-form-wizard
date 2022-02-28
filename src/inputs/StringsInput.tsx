import {
    Button,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    InputGroup,
    TextInput as PFTextInput,
} from '@patternfly/react-core'
import { PlusIcon, TrashIcon } from '@patternfly/react-icons'
import { Fragment } from 'react'
import { TextInput } from '..'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, useInput } from './Input'
import { InputLabel } from './InputLabel'

type StringsInputProps = InputCommonProps & {
    placeholder?: string
}

export function StringsInput(props: StringsInputProps) {
    const { displayMode: mode, value, setValue, id, hidden } = useInput(props)

    let values: string[] = value
    if (!values) values = []

    const onNewKey = () => {
        values.push('')
        setValue(values)
    }

    const onDeleteKey = (index: number) => {
        values.splice(index, 1)
        setValue(values)
    }

    if (hidden) {
        return <Fragment />
    }

    if (mode === DisplayMode.Details) {
        if (!values.length) return <Fragment />
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {values.map((value, index) => {
                            if (!value) return <Fragment key={index} />
                            return <div key={index}>{value}</div>
                        })}
                    </div>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <InputLabel {...props} id={id}>
            <div id={id} style={{ display: 'flex', flexDirection: 'column', rowGap: values.length ? 8 : 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                    {values.map((_, index) => {
                        return (
                            <InputGroup key={index}>
                                <TextInput
                                    id={`${id}-${index + 1}`}
                                    path={props.path + '.' + index.toString()}
                                    // onChange={(e) => onKeyChange(index, e)}
                                    required
                                    disablePaste
                                />
                                <Button
                                    variant="plain"
                                    isDisabled={props.required === true && values.length === 1}
                                    aria-label="Remove item"
                                    onClick={() => onDeleteKey(index)}
                                    style={{ alignSelf: 'start' }}
                                >
                                    <TrashIcon />
                                </Button>
                            </InputGroup>
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
        </InputLabel>
    )
}

type StringsMapInputProps = StringsInputProps & {
    map?: (value: any) => string[]
    unmap?: (values: string[]) => any
}

export function StringsMapInput(props: StringsMapInputProps) {
    const { displayMode: mode, value, setValue, id, hidden } = useInput(props)

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

    if (hidden) {
        return <Fragment />
    }

    if (mode === DisplayMode.Details) {
        if (!values.length) return <Fragment />
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>{props.label}</DescriptionListTerm>
                <DescriptionListDescription id={id}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                        {values.map((value, index) => {
                            if (!value) return <Fragment key={index} />
                            return <div key={index}>{value}</div>
                        })}
                    </div>
                </DescriptionListDescription>
            </DescriptionListGroup>
        )
    }

    return (
        <InputLabel {...props} id={id}>
            <div id={id} style={{ display: 'flex', flexDirection: 'column', rowGap: values.length ? 8 : 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                    {values.map((pair, index) => {
                        return (
                            <InputGroup key={index}>
                                <PFTextInput id={`${id}-${index + 1}`} value={pair} onChange={(e) => onKeyChange(index, e)} required />
                                <Button
                                    variant="plain"
                                    isDisabled={props.required === true && values.length === 1}
                                    aria-label="Remove item"
                                    onClick={() => onDeleteKey(index)}
                                    style={{ alignSelf: 'start' }}
                                >
                                    <TrashIcon />
                                </Button>
                            </InputGroup>
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
        </InputLabel>
    )
}
