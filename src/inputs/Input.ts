import get from 'get-value'
import { useCallback, useContext, useLayoutEffect } from 'react'
import set from 'set-value'
import { useData } from '../contexts/DataContext'
import { useDisplayMode } from '../contexts/DisplayModeContext'
import { useSetHasInputs, useUpdateHasInputs } from '../contexts/HasInputsProvider'
import { useSetHasValue } from '../contexts/HasValueProvider'
import { ItemContext } from '../contexts/ItemContext'
import { useShowValidation } from '../contexts/ShowValidationProvider'
import { useSetHasValidationError, useValidate } from '../contexts/ValidationProvider'

export type HiddenFn = (item: any) => boolean

export type InputCommonProps<ValueT = any> = {
    id?: string

    /* JSON dot notation path to the input value in the active item context */
    path: string
    hidden?: (item: any) => boolean
    validation?: (value: ValueT) => string | undefined
    required?: boolean
    readonly?: boolean
    disabled?: boolean
    label?: string
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
}

export function useID(props: { id?: string; path: string }) {
    if (props.id) return props.id
    return props.path.toLowerCase().split('.').join('-')
}

export function usePath(props: { path: string }) {
    return props.path
}

export function useValue(
    props: Pick<InputCommonProps, 'id' | 'path' | 'label'>,
    defaultValue: any
): [value: any, setValue: (value: any) => void] {
    const item = useContext(ItemContext)
    const { update } = useData()
    const path = usePath(props)
    const value = get(item, path) ?? defaultValue
    const setValue = useCallback(
        (value: any) => {
            set(item, path, value, { preservePaths: false })
            update()
        },
        [item, path, update]
    )
    return [value, setValue]
}

export function useInputValidation(props: Pick<InputCommonProps, 'id' | 'path' | 'label' | 'required' | 'validation'>) {
    const [value] = useValue(props, '')
    const showValidation = useShowValidation()

    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (props.required && !value) {
        if (props.label) error = `${props.label} is required`
        else error = 'Required'
    } else if (props.validation) {
        error = props.validation(value)
    }
    if (showValidation) {
        validated = error ? 'error' : undefined
    }
    return { validated, error }
}

export function useInputHidden(props: { hidden?: (item: any) => boolean }) {
    const item = useContext(ItemContext)
    return props.hidden ? props.hidden(item) : false
}

export function lowercaseFirst(label: string) {
    if (label) {
        label = label[0].toLowerCase() + label.substr(1)
    }
    return label
}

export function useInput(props: InputCommonProps) {
    const displayMode = useDisplayMode()
    const [value, setValue] = useValue(props, '')
    const hidden = useInputHidden(props)

    const setHasInputs = useSetHasInputs()
    useLayoutEffect(() => {
        if (!hidden) setHasInputs()
    }, [hidden, setHasInputs])

    const updateHasInputs = useUpdateHasInputs()
    useLayoutEffect(() => updateHasInputs(), [hidden, updateHasInputs])

    const { validated, error } = useInputValidation(props)
    const setHasValidationError = useSetHasValidationError()
    useLayoutEffect(() => {
        if (!hidden && error) setHasValidationError()
    }, [hidden, error, setHasValidationError])

    const validate = useValidate()
    // if value changes we need to validate in the case of a checkbox which hides child inputs
    // if hidden changes we need to validate in the case of a inputs which hides child inputs
    // if error changes we need to validate to set the error or clear errors if there is no other inputs with errors
    useLayoutEffect(() => validate(), [value, hidden, error, validate])

    const path = usePath(props)
    const id = useID(props)

    const setHasValue = useSetHasValue()
    useLayoutEffect(() => {
        if (value) setHasValue()
    }, [setHasValue, value])

    // const updateHasValue = useUpdateHasValue()
    // useEffect(() => {
    //     if (!value) updateHasValue()
    // }, [updateHasValue, value])

    return {
        id,
        path,
        displayMode,
        value,
        setValue,
        validated,
        error,
        hidden,
    }
}