import get from 'get-value'
import { Children, isValidElement, ReactElement, ReactNode, useCallback, useContext, useEffect } from 'react'
import set from 'set-value'
import { FormWizardArrayInput, FormWizardSelector, wizardArrayItems, wizardSelectorItem } from '..'
import { useData } from '../contexts/DataContext'
import { useSetHasValue } from '../contexts/HasValueProvider'
import { ItemContext } from '../contexts/ItemContext'
import { useMode } from '../contexts/ModeContext'
import { useShowValidation } from '../contexts/ShowValidationProvider'
import { useSetHasValidationError, useValidate } from '../contexts/ValidationProvider'

export type HiddenFn = (item: any) => boolean

export type InputCommonProps<ValueT = any> = {
    id?: string
    path?: string
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

export function useID(props: { id?: string; path?: string; label?: string }) {
    if (props.id) return props.id
    if (props.label) return props.label.toLowerCase().split(' ').join('-')
    if (props.path) return props.path.split('.').join('-')
    return 'unknown'
}

export function usePath(props: { id?: string; path?: string; label?: string }) {
    if (props.path) return props.path
    if (props.id) return props.id
    if (props.label) return props.label.toLowerCase().split(' ').join('-')
    return 'unknown'
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

export function isHidden(reactElement: ReactElement, item: any) {
    const hidden = (reactElement.props as { hidden?: HiddenFn }).hidden
    if (typeof hidden === 'function') {
        try {
            const result = hidden(item)
            if (result === true) return true
        } catch {
            // Do nothing
        }
    }

    let allChildrenHidden = true
    switch (reactElement.type) {
        case FormWizardArrayInput: {
            const items = wizardArrayItems(reactElement.props, item)
            for (const item of items) {
                Children.forEach(reactElement.props.children, (child) => {
                    if (!allChildrenHidden) return
                    if (!isValidElement(child)) {
                        allChildrenHidden = false
                        return
                    }
                    if (!isHidden(child, item)) {
                        allChildrenHidden = false
                    }
                })
            }
            break
        }
        case FormWizardSelector: {
            const selectorItem = wizardSelectorItem(reactElement.props, item)
            if (selectorItem) {
                Children.forEach(reactElement.props.children, (child) => {
                    if (!allChildrenHidden) return
                    if (!isValidElement(child)) {
                        allChildrenHidden = false
                        return
                    }
                    if (!isHidden(child, selectorItem)) {
                        allChildrenHidden = false
                    }
                })
            }
            break
        }
        default: {
            if (reactElement.props.children === 'function') {
                allChildrenHidden = false
            } else if (reactElement.props.children === undefined) {
                allChildrenHidden = false
            } else {
                Children.forEach(reactElement.props.children, (child) => {
                    if (!allChildrenHidden) return
                    if (!isValidElement(child)) {
                        allChildrenHidden = false
                        return
                    }
                    if (!isHidden(child, item)) {
                        allChildrenHidden = false
                    }
                })
            }
            break
        }
    }

    return allChildrenHidden
}

export function wizardInputHasValidationErrors(reactElement: ReactElement, item: any): boolean {
    if (isHidden(reactElement, item)) return false

    const { props } = reactElement

    switch (reactElement.type) {
        case FormWizardArrayInput:
            {
                const arrayItems = wizardArrayItems(reactElement.props, item)
                for (const arrayItem of arrayItems) {
                    for (const child of Children.toArray(reactElement.props.children)) {
                        if (!isValidElement(child)) continue
                        if (wizardInputHasValidationErrors(child, arrayItem)) return true
                    }
                }
            }
            break
        case FormWizardSelector: {
            const selectorItem = wizardSelectorItem(reactElement.props, item)
            if (selectorItem) {
                for (const child of Children.toArray(reactElement.props.children)) {
                    if (!isValidElement(child)) continue
                    if (wizardInputHasValidationErrors(child, selectorItem)) return true
                }
            }
            break
        }
        default:
            {
                if (!reactElement.props) break
                const path = props.path
                if (path) {
                    const value = get(item, path) as unknown

                    const required = props.required
                    if (required && !value) return true

                    const validation = props.validation as (value: any) => string | undefined
                    if (typeof validation === 'function') {
                        try {
                            const result = validation(value)
                            if (typeof result === 'string') return true
                        } catch {
                            // Do nothing
                        }
                    }
                }
                for (const child of Children.toArray(reactElement.props.children)) {
                    if (!isValidElement(child)) continue
                    if (wizardInputHasValidationErrors(child, item)) return true
                }
            }
            break
    }

    return false
}

export function inputHasValue(props: unknown, item: unknown) {
    const path = (props as InputCommonProps).path
    if (path !== undefined) {
        const value = get(item as object, path)
        if (value === undefined) return false
        if (typeof value === 'string') {
            return value !== '' && value !== undefined
        }
        if (typeof value === 'number') {
            return value !== 0
        }
        if (typeof value === 'boolean') {
            return true
        }
        if (Array.isArray(value)) {
            return value.length > 0
        }
    }

    const children = (props as { children?: ReactNode }).children
    if (children) {
        let anyChildHasValue = false
        Children.forEach(children, (child) => {
            if (anyChildHasValue) return
            if (!isValidElement(child)) return
            if (isHidden(child, item)) return
            if (inputHasValue(child.props, item)) {
                anyChildHasValue = true
            }
        })
        return anyChildHasValue
    }
    return false
}

export function lowercaseFirst(label: string) {
    if (label) {
        label = label[0].toLowerCase() + label.substr(1)
    }
    return label
}

export function useInput(props: InputCommonProps) {
    const mode = useMode()
    const [value, setValue] = useValue(props, '')
    const hidden = useInputHidden(props)

    const { validated, error } = useInputValidation(props)

    // If setValid changes, it is an indication that validation is needed
    const setHasValidationError = useSetHasValidationError()
    useEffect(() => {
        if (!hidden && error) setHasValidationError()
    }, [hidden, error, setHasValidationError])

    // If error changes, trigger validation
    const validate = useValidate()
    useEffect(() => validate(), [error, validate])

    const path = usePath(props)
    const id = useID(props)

    const setHasValue = useSetHasValue()
    useEffect(() => {
        if (value) setHasValue()
    }, [setHasValue, value])

    // const updateHasValue = useUpdateHasValue()
    // useEffect(() => {
    //     if (!value) updateHasValue()
    // }, [updateHasValue, value])

    return {
        id,
        path,
        mode,
        value,
        setValue,
        validated,
        error,
        hidden,
    }
}
