import get from 'get-value'
import { Children, isValidElement, ReactElement, ReactNode, useContext } from 'react'
import set from 'set-value'
import { FormWizardArrayInput, FormWizardSelector, wizardArrayItems, wizardSelectorItem } from '..'
import { FormWizardContext, IFormWizardContext } from '../contexts/FormWizardContext'
import { FormWizardItemContext } from '../contexts/FormWizardItemContext'
import { FormWizardValidationContext } from '../contexts/FormWizardValidationContext'

export type HiddenFn = (item: any) => boolean

export type InputCommonProps<ValueT = any> = {
    id: string
    path?: string
    hidden?: (item: any) => boolean
    validation?: (value: ValueT) => string | undefined
    required?: boolean
    readonly?: boolean
    disabled?: boolean
    label: string
    labelHelp?: string
    labelHelpTitle?: string
    helperText?: string
}

export function useInputValue(
    props: Pick<InputCommonProps, 'id' | 'path'>,
    defaultValue: any
): [value: any, setValue: (value: any) => void] {
    const item = useContext(FormWizardItemContext)
    const formWizardContext = useContext(FormWizardContext)
    const path = props.path ?? props.id
    const value = get(item, path) ?? defaultValue
    const setValue = (value: any) => inputSetValue(props, item, value, formWizardContext)
    return [value, setValue]
}

export function inputGetValue(props: Pick<InputCommonProps, 'id' | 'path'>, item: object) {
    const path = props.path ?? props.id
    const value = get(item, path) ?? null
    return value
}

export function inputSetValue<T = any>(
    props: Pick<InputCommonProps, 'id' | 'path'>,
    item: object,
    value: T,
    formWizardContext: IFormWizardContext
) {
    const path = props.path ?? props.id
    set(item, path, value, { preservePaths: false })
    formWizardContext.updateContext()
}

export function useInputValidation(props: Pick<InputCommonProps, 'id' | 'path' | 'label' | 'required' | 'validation'>) {
    const item = useContext(FormWizardItemContext)
    const validationContext = useContext(FormWizardValidationContext)

    const value = inputGetValue(props, item)
    let error: string | undefined = undefined
    let validated: 'error' | undefined = undefined
    if (validationContext.showValidation) {
        if (props.required && !value) {
            error = `${props.label} is required`
        } else if (props.validation) {
            error = props.validation(value)
        }
        validated = error ? 'error' : undefined
    }
    return { validated, error }
}

export function useInputHidden(props: { hidden?: (item: any) => boolean }) {
    const item = useContext(FormWizardItemContext)
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
