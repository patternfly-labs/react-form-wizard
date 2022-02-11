import { NumberInput as PFNumberInput } from '@patternfly/react-core'
import { Fragment, useCallback } from 'react'
import { TextDetail } from '..'
import { DisplayMode } from '../contexts/DisplayModeContext'
import { InputCommonProps, lowercaseFirst, useInput } from './Input'
import { InputLabel } from './InputLabel'

export type NumberInputProps = InputCommonProps<string> & {
    label: string
    placeholder?: string
    secret?: boolean
    min?: number
    max?: number
    zeroIsUndefined?: boolean
}

export function NumberInput(props: NumberInputProps) {
    const { displayMode: mode, value, setValue, disabled, hidden, id } = useInput(props)

    const onMinus = useCallback(() => {
        const newValue = typeof value === 'number' ? value - 1 : 0
        if (props.zeroIsUndefined && newValue === 0) {
            setValue(undefined)
        } else {
            setValue(newValue)
        }
    }, [props.zeroIsUndefined, setValue, value])

    const onChange = useCallback(
        (event) => {
            const newValue = Number(event.target.value)
            if (props.zeroIsUndefined && newValue === 0) {
                setValue(undefined)
            } else {
                if (Number.isInteger(newValue)) setValue(newValue)
            }
        },
        [props.zeroIsUndefined, setValue]
    )
    const onPlus = useCallback(() => {
        if (typeof value === 'number') setValue(value + 1)
        else setValue(1)
    }, [setValue, value])

    if (hidden) return <Fragment />

    if (mode === DisplayMode.Details) {
        if (!value) return <Fragment />
        return <TextDetail id={id} path={props.path} label={props.label} />
    }

    const placeholder = props.placeholder ?? `Enter the ${lowercaseFirst(props.label)}`

    return (
        <InputLabel {...props} id={id}>
            <PFNumberInput
                id={id}
                placeholder={placeholder}
                // validated={validated}
                value={value}
                onMinus={onMinus}
                onChange={onChange}
                onPlus={onPlus}
                min={props.min === undefined ? 0 : props.min}
                max={props.max}
                // isReadOnly={props.readonly}
                // type={!props.secret || showSecrets ? 'text' : 'password'}
                isDisabled={disabled}
            />
        </InputLabel>
    )
}
